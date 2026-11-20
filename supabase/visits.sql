-- Private visit counter. Run once in Supabase: SQL Editor → New query → paste → Run.
-- Stores only page + day + two counts. No IP addresses, no cookies, nothing about the visitor.
-- See the numbers in Supabase → Table Editor → visits (or run: select * from visits_by_day;).

create table if not exists public.visits (
  day      date    not null default current_date,
  path     text    not null check (char_length(path) between 1 and 100),
  views    integer not null default 0,  -- page loads
  visitors integer not null default 0,  -- browsers counted once per day (first page they open)
  primary key (day, path)
);

-- Nobody can read or change the table through the public key; only record_visit can add to it.
alter table public.visits enable row level security;
revoke all on public.visits from anon, authenticated;

create or replace function public.record_visit(p_path text, p_new_visitor boolean)
returns void
language sql
security definer
set search_path = public
as $$
  insert into visits (path, views, visitors)
  values (left(p_path, 100), 1, case when p_new_visitor then 1 else 0 end)
  on conflict (day, path) do update
    set views    = visits.views + 1,
        visitors = visits.visitors + excluded.visitors;
$$;

revoke all on function public.record_visit(text, boolean) from public;
grant execute on function public.record_visit(text, boolean) to anon, authenticated;

-- Totals per day, for you only (not readable with the public key).
create or replace view public.visits_by_day with (security_invoker = true) as
  select day, sum(visitors) as visitors, sum(views) as views
  from public.visits group by day order by day desc;
revoke all on public.visits_by_day from anon, authenticated;

-- Online leaderboard for the 40-line game.
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.scores (
  name       text primary key check (char_length(name) between 1 and 20),
  time_ms    integer not null check (time_ms between 10000 and 3600000), -- 10 s .. 1 h
  pieces     integer not null check (pieces >= 100),                     -- 40 lines need at least 100 pieces
  updated_at timestamptz not null default now()
);

create index if not exists scores_time_idx on public.scores (time_ms);

-- Anyone can read the leaderboard, nobody can write to the table directly.
alter table public.scores enable row level security;
revoke all on public.scores from anon, authenticated;
grant select on public.scores to anon, authenticated;

drop policy if exists "leaderboard is public" on public.scores;
create policy "leaderboard is public" on public.scores for select to anon, authenticated using (true);

-- The only way to write: submit a run. It's kept only if it beats that name's best time.
create or replace function public.submit_score(p_name text, p_time_ms integer, p_pieces integer)
returns void
language sql
security definer
set search_path = public
as $$
  insert into scores (name, time_ms, pieces)
  values (trim(p_name), p_time_ms, p_pieces)
  on conflict (name) do update
    set time_ms = excluded.time_ms, pieces = excluded.pieces, updated_at = now()
    where excluded.time_ms < scores.time_ms;
$$;

revoke all on function public.submit_score(text, integer, integer) from public;
grant execute on function public.submit_score(text, integer, integer) to anon, authenticated;

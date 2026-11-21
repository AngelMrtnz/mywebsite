// Supabase connection for the private visit counter.
// Turned on by two public settings in .env.production:
//   NEXT_PUBLIC_SUPABASE_URL       e.g. https://abcd1234.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY  the project's public "anon" / "publishable" key
// The key is meant to be public: the database only allows calling record_visit
// (see supabase/visits.sql). Without these settings the counter is off.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(URL && KEY);

/** Calls a database function. */
export async function rpc(name: string, args: Record<string, unknown>, keepalive = false): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
    keepalive,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
}

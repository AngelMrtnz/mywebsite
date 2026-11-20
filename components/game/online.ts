// Shared online leaderboard (Supabase). Turned on by two public settings in .env.production:
//   NEXT_PUBLIC_SUPABASE_URL      e.g. https://abcd1234.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY the project's public "anon" / "publishable" key
// The key is meant to be public: the database only allows reading scores and calling
// submit_score (see supabase/leaderboard.sql). Without these settings the game keeps
// scores in the browser only.
import type { Score } from './storage';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const onlineLeaderboard = Boolean(URL && KEY);

const headers = () => ({ apikey: KEY!, 'Content-Type': 'application/json' });

interface Row {
  name: string;
  time_ms: number;
  pieces: number;
  updated_at: string;
}

/** Top 20 fastest players. Throws if the leaderboard can't be reached. */
export async function fetchTopScores(): Promise<Score[]> {
  const res = await fetch(
    `${URL}/rest/v1/scores?select=name,time_ms,pieces,updated_at&order=time_ms.asc&limit=20`,
    { headers: headers(), cache: 'no-store' }
  );
  if (!res.ok) throw new Error(`Leaderboard: ${res.status}`);
  const rows: Row[] = await res.json();
  return rows.map((r) => ({ name: r.name, time: r.time_ms, pieces: r.pieces, date: r.updated_at }));
}

/** Sends a finished run. The database keeps it only if it beats that name's best. */
export async function submitScore(name: string, time: number, pieces: number): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/rpc/submit_score`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ p_name: name, p_time_ms: Math.round(time), p_pieces: pieces }),
  });
  if (!res.ok) throw new Error(`Submit: ${res.status}`);
}

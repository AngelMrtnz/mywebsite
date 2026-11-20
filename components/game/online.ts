// Shared online leaderboard (see lib/supabase.ts and supabase/leaderboard.sql).
// Without the Supabase settings the game keeps scores in the browser only.
import { rpc, select, supabaseEnabled } from '@/lib/supabase';
import type { Score } from './storage';

export const onlineLeaderboard = supabaseEnabled;

interface Row {
  name: string;
  time_ms: number;
  pieces: number;
  updated_at: string;
}

/** Top 20 fastest players. Throws if the leaderboard can't be reached. */
export async function fetchTopScores(): Promise<Score[]> {
  const rows = await select<Row[]>('scores?select=name,time_ms,pieces,updated_at&order=time_ms.asc&limit=20');
  return rows.map((r) => ({ name: r.name, time: r.time_ms, pieces: r.pieces, date: r.updated_at }));
}

/** Sends a finished run. The database keeps it only if it beats that name's best. */
export function submitScore(name: string, time: number, pieces: number): Promise<void> {
  return rpc('submit_score', { p_name: name, p_time_ms: Math.round(time), p_pieces: pieces });
}

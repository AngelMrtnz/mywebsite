'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { rpc, supabaseEnabled } from '@/lib/supabase';

const DAY_KEY = 'visits:last-day';

/** Counts page views (private, see supabase/visits.sql). Renders nothing. */
export default function VisitCounter() {
  const pathname = usePathname();

  useEffect(() => {
    if (!supabaseEnabled || process.env.NODE_ENV !== 'production') return;
    if (['localhost', '127.0.0.1'].includes(location.hostname)) return;

    // A browser counts as a visitor once per day: on the first page it opens that day
    const today = new Date().toISOString().slice(0, 10);
    let newVisitor = true;
    try {
      newVisitor = localStorage.getItem(DAY_KEY) !== today;
      localStorage.setItem(DAY_KEY, today);
    } catch {}

    rpc('record_visit', { p_path: pathname, p_new_visitor: newVisitor }, true).catch(() => {});
  }, [pathname]);

  return null;
}

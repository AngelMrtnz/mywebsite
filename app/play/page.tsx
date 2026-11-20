import type { Metadata } from 'next';
import BlockGame from '@/components/game/BlockGame';
import { PageTitle } from '@/components/Headings';

export const metadata: Metadata = { title: 'Play' };

export default function Play() {
  return (
    <>
      <PageTitle>Play</PageTitle>
      <BlockGame />
    </>
  );
}

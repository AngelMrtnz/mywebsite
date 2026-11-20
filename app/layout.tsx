import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import LayoutShell from '@/components/LayoutShell';
import { asset } from '@/lib/paths';
import './globals.css';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: { default: 'Ángel Martínez Muñoz', template: '%s · Ángel Martínez Muñoz' },
  description: 'PhD student in Mathematics at Universitat Rovira i Virgili',
  icons: { icon: asset('/favicon.svg') },
  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

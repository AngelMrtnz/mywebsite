import type { Metadata } from "next";
import { Lato } from "next/font/google"; // Import Lato
import "./globals.css";
import "katex/dist/katex.min.css"; // Import KaTeX CSS
import LayoutShell from "@/components/LayoutShell";

// Configure Lato font
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // Include weights you need
});

export const metadata: Metadata = {
  title: "Ángel Martínez Muñoz",
  description: "PhD student in Mathematics at Universitat Rovira i Virgili",
  icons: {
    icon: '/torus-frames/frame-0.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.className}`}> {/* Apply font class */}
        <LayoutShell>
          {children}
        </LayoutShell>
      </body>
    </html>
  );
}

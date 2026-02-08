import type { Metadata } from "next";
import { Lato } from "next/font/google"; // Import Lato
import "./globals.css";
import "katex/dist/katex.min.css"; // Import KaTeX CSS
import Sidebar from "../components/Sidebar";

// Configure Lato font
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"], // Include weights you need
});

export const metadata: Metadata = {
  title: "Ángel Martínez Muñoz",
  description: "PhD student in Mathematics at Universitat Rovira i Virgili",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lato.className} flex`}> {/* Apply font class */}
        <Sidebar />
        <main className="flex-1 ml-64 p-8 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

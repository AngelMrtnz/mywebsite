import type { Metadata } from "next"
import "./globals.css"
import Footer from "../components/Footer" // Import the Footer component

export const metadata: Metadata = {
  title: "Ángel Martínez Muñoz",
  description: "PhD student in Mathematics at Universitat Rovira i Virgili",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer /> {/* Render the Footer component here */}
      </body>
    </html>
  )
}

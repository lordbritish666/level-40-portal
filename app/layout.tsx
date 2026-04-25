import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import "./globals.css"

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Eizaz's Level 40 Unlocked!",
  description: "A 40th Birthday Live Session — Drum Asia Live, Hartamas",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={pixelFont.variable}>
      <body style={{ fontFamily: "var(--font-pixel), monospace" }}>
        <div style={{ position: "relative", zIndex: 2, minHeight: "100vh" }}>
          {children}
        </div>
      </body>
    </html>
  )
}

"use client"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">

      {/* Poster image */}
      <div className="float" style={{ marginBottom: "2rem", position: "relative" }}>
        <div style={{
          border: "6px solid #ffd700",
          boxShadow: "8px 8px 0 0 #b8860b, 0 0 40px rgba(255,215,0,0.3)",
          lineHeight: 0,
          maxWidth: 380,
          width: "100%",
        }}>
          <Image
            src="/poster.jpg"
            alt="Eizaz's Level 40 Unlocked — Insert Coin"
            width={380}
            height={570}
            style={{ width: "100%", height: "auto", display: "block", imageRendering: "pixelated" }}
            priority
          />
        </div>
      </div>

      {/* Main card */}
      <div className="pixel-card" style={{ maxWidth: 380, width: "100%", padding: "1.75rem", marginBottom: "1.5rem" }}>
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <div className="blink" style={{ fontSize: "0.8rem", color: "#fff", letterSpacing: "0.15em" }}>
            ▶ INSERT COIN
          </div>
        </div>
        <Link href="/join">
          <button className="pixel-btn" style={{
            width: "100%",
            background: "#ffd700",
            color: "#000",
            fontSize: "0.75rem",
            padding: "1rem",
          }}>
            ENTER THE PARTY
          </button>
        </Link>
      </div>

      {/* Bottom links */}
      <div className="flex gap-4 flex-wrap justify-center" style={{ fontSize: "0.5rem" }}>
        <Link href="/stage" style={{ color: "#00ff88", textDecoration: "none" }}>▶ STAGE &amp; VOTING</Link>
        <span style={{ color: "#444" }}>|</span>
        <Link href="/cocktails" style={{ color: "#ff88cc", textDecoration: "none" }}>▶ COCKTAIL MENU</Link>
        <span style={{ color: "#444" }}>|</span>
        <Link href="/admin" style={{ color: "#888", textDecoration: "none" }}>▶ HOST ADMIN</Link>
      </div>

    </div>
  )
}

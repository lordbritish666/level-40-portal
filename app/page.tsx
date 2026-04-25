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
      <div className="pixel-card" style={{ maxWidth: 380, width: "100%", padding: "1.75rem" }}>
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <div className="blink" style={{ fontSize: "0.8rem", color: "#fff", letterSpacing: "0.15em" }}>
            ▶ INSERT COIN
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/join">
            <button className="pixel-btn" style={{ width: "100%", background: "#ffd700", color: "#000", fontSize: "0.75rem", padding: "1rem" }}>
              ENTER THE PARTY
            </button>
          </Link>
          <Link href="/stage">
            <button className="pixel-btn" style={{ width: "100%", background: "#00ff88", color: "#000", fontSize: "0.65rem", padding: "0.85rem" }}>
              🎵 LIVE STAGE
            </button>
          </Link>
          <Link href="/vote">
            <button className="pixel-btn" style={{ width: "100%", background: "#ff8800", color: "#000", fontSize: "0.65rem", padding: "0.85rem" }}>
              🗳️ VOTE FOR SONGS
            </button>
          </Link>
          <Link href="/cocktails">
            <button className="pixel-btn" style={{ width: "100%", background: "#ff88cc", color: "#000", fontSize: "0.65rem", padding: "0.85rem" }}>
              🍹 COCKTAIL MENU
            </button>
          </Link>
          <Link href="/rooms">
            <button className="pixel-btn" style={{ width: "100%", background: "#9966ff", color: "#fff", fontSize: "0.65rem", padding: "0.85rem" }}>
              🗺️ VENUE MAP
            </button>
          </Link>
          <a href="https://eizazbirthday.personalise.me/a/fde63a09-1d06-441f-be31-6e4eba6e0879" target="_blank" rel="noopener noreferrer">
            <button className="pixel-btn" style={{ width: "100%", background: "#00ccff", color: "#000", fontSize: "0.65rem", padding: "0.85rem" }}>
              📸 PRINT PHOTO
            </button>
          </a>
        </div>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <Link href="/admin" style={{ fontSize: "0.4rem", color: "#444", textDecoration: "none" }}>▶ HOST ADMIN</Link>
      </div>

    </div>
  )
}

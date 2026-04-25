"use client"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Title */}
      <div className="text-center mb-8 float">
        <div style={{ fontSize: "0.6rem", color: "#ffd700", marginBottom: "0.5rem", letterSpacing: "0.3em" }}>
          ✦ APRIL 25, 2026 ✦ DRUM ASIA LIVE, HARTAMAS ✦
        </div>
        <h1 className="pulse-gold" style={{
          fontSize: "clamp(2rem, 8vw, 4rem)",
          color: "#ffd700",
          textShadow: "4px 4px 0px #b8860b, 0 0 30px #ffd700",
          lineHeight: 1.2,
          marginBottom: "0.25em",
        }}>
          LEVEL 40
        </h1>
        <div style={{
          fontSize: "clamp(0.7rem, 3vw, 1.1rem)",
          color: "#fff",
          letterSpacing: "0.2em",
          textShadow: "2px 2px 0px #000",
        }}>
          UNLOCKED
        </div>
      </div>

      {/* Pixel character row */}
      <div className="flex gap-6 mb-8" style={{ fontSize: "0.55rem", color: "#aaa" }}>
        {[
          { name: "CHRONO", hp: "404/404", mp: "40/40", color: "#4488ff" },
          { name: "AYLA", hp: "400/400", mp: "40/40", color: "#ff88aa" },
          { name: "LUCCA", hp: "380/380", mp: "40/40", color: "#ffaa44" },
          { name: "ROBO", hp: "420/420", mp: "40/40", color: "#44ff88" },
        ].map((char) => (
          <div key={char.name} className="pixel-panel text-center" style={{ padding: "0.5rem 0.75rem", minWidth: "70px" }}>
            <div style={{ width: 20, height: 20, background: char.color, margin: "0 auto 4px", border: "2px solid #000" }} />
            <div style={{ color: char.color, marginBottom: "0.25rem" }}>{char.name}</div>
            <div style={{ fontSize: "0.45rem", color: "#0f0" }}>HP {char.hp}</div>
            <div style={{ fontSize: "0.45rem", color: "#44f" }}>MP {char.mp}</div>
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="pixel-card" style={{ maxWidth: 480, width: "100%", padding: "2rem", marginBottom: "2rem" }}>
        <div className="text-center" style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.6rem", color: "#aaa", marginBottom: "0.5rem" }}>
            A 40TH BIRTHDAY LIVE SESSION
          </div>
          <div style={{ fontSize: "0.55rem", color: "#ffd700", lineHeight: 1.8 }}>
            LIVE MUSIC · VR STATION<br />
            ALCOHOL · CIGARS · CHAOS
          </div>
        </div>

        <div className="text-center" style={{ marginBottom: "2rem" }}>
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
        <Link href="/stage" style={{ color: "#00ff88", textDecoration: "none" }}>
          ▶ STAGE &amp; VOTING
        </Link>
        <span style={{ color: "#444" }}>|</span>
        <Link href="/cocktails" style={{ color: "#ff88cc", textDecoration: "none" }}>
          ▶ COCKTAIL MENU
        </Link>
        <span style={{ color: "#444" }}>|</span>
        <Link href="/admin" style={{ color: "#888", textDecoration: "none" }}>
          ▶ HOST ADMIN
        </Link>
      </div>

      <div style={{ marginTop: "2rem", fontSize: "0.45rem", color: "#444", textAlign: "center" }}>
        &quot;I GREW UP ON CARTRIDGES AND CATHODE RAYS.<br />
        TONIGHT, WE&apos;RE RUNNING IT BACK — JUST HIGHER RESOLUTION.&quot;
      </div>
    </div>
  )
}

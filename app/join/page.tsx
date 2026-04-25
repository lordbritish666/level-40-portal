"use client"
import Link from "next/link"

export default function JoinPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" style={{ fontSize: "0.5rem", color: "#888", marginBottom: "2rem", textDecoration: "none" }}>
        ← BACK
      </Link>

      <div className="text-center" style={{ marginBottom: "2.5rem" }}>
        <div style={{ fontSize: "0.55rem", color: "#888", marginBottom: "0.75rem" }}>PLAYER SELECT</div>
        <h2 style={{ fontSize: "clamp(1rem, 5vw, 1.5rem)", color: "#ffd700", textShadow: "3px 3px 0px #b8860b" }}>
          WHO ARE YOU?
        </h2>
      </div>

      <div className="flex flex-col gap-6" style={{ width: "100%", maxWidth: 480 }}>

        {/* Musician card */}
        <Link href="/register/musician" style={{ textDecoration: "none" }}>
          <div className="pixel-card" style={{ padding: "1.75rem", cursor: "pointer", transition: "transform 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "")}>
            <div className="flex items-start gap-4">
              <div style={{
                fontSize: "2rem",
                width: 56,
                height: 56,
                background: "#111",
                border: "4px solid #ffd700",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>🎸</div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#ffd700", marginBottom: "0.5rem" }}>I AM A MUSICIAN</div>
                <div style={{ fontSize: "0.5rem", color: "#aaa", lineHeight: 2 }}>
                  BASSIST · DRUMMER · KEYS<br />
                  GUITARIST · OTHER
                </div>
                <div style={{ fontSize: "0.45rem", color: "#00ff88", marginTop: "0.5rem" }}>
                  ▶ JOIN THE BAND ROSTER
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Singer card */}
        <Link href="/register/singer" style={{ textDecoration: "none" }}>
          <div className="pixel-card" style={{ padding: "1.75rem", cursor: "pointer", borderColor: "#00ff88", boxShadow: "8px 8px 0px 0px rgba(0,255,136,0.3)", transition: "transform 0.1s" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translate(-2px,-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "")}>
            <div className="flex items-start gap-4">
              <div style={{
                fontSize: "2rem",
                width: 56,
                height: 56,
                background: "#111",
                border: "4px solid #00ff88",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>🎤</div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#00ff88", marginBottom: "0.5rem" }}>I AM A SINGER</div>
                <div style={{ fontSize: "0.5rem", color: "#aaa", lineHeight: 2 }}>
                  PICK 3 SONGS FOR YOUR SET<br />
                  GET A RANDOM BAND
                </div>
                <div style={{ fontSize: "0.45rem", color: "#ffd700", marginTop: "0.5rem" }}>
                  ▶ QUEUE UP FOR THE STAGE
                </div>
              </div>
            </div>
          </div>
        </Link>

      </div>

      <div style={{ marginTop: "2.5rem", fontSize: "0.5rem", color: "#666", textAlign: "center", lineHeight: 2 }}>
        MUSICIANS CAN ALSO SING.<br />
        SINGERS CAN ALSO PLAY AN INSTRUMENT.<br />
        SIGN UP FOR BOTH IF YOU&apos;RE BRAVE.
      </div>
    </div>
  )
}

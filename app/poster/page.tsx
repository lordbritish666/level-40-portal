"use client"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const QRCodeCanvas = dynamic(() => import("./QRCode"), { ssr: false })

// Stars layer — static positions to avoid hydration mismatch
const STARS = [
  [8, 4], [15, 12], [22, 7], [30, 18], [38, 3], [45, 14], [52, 9], [60, 20],
  [67, 5], [74, 16], [80, 2], [88, 11], [93, 22], [5, 28], [12, 35], [20, 40],
  [28, 30], [36, 45], [44, 25], [50, 38], [58, 32], [65, 48], [72, 28], [78, 42],
  [85, 36], [92, 50], [3, 55], [10, 62], [18, 58], [25, 68], [33, 52], [40, 72],
  [48, 65], [55, 78], [62, 60], [70, 75], [76, 82], [83, 56], [90, 70], [97, 63],
].map(([x, y]) => ({ x, y, size: Math.floor(((x * y) % 3) + 1) }))

export default function PosterPage() {
  const [portalUrl, setPortalUrl] = useState("https://your-app.vercel.app/join")
  const [editing, setEditing] = useState(false)
  const [inputUrl, setInputUrl] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("poster_url")
    const origin = window.location.origin
    const defaultUrl = saved || `${origin}/join`
    setPortalUrl(defaultUrl)
    setInputUrl(defaultUrl)
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d2b",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "1rem",
      gap: "1rem",
    }}>
      {/* Controls — hidden when printing */}
      <div className="no-print" style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {editing ? (
          <>
            <input
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              style={{
                background: "#0a0a3e",
                border: "3px solid #ffd700",
                color: "#ffd700",
                fontFamily: "var(--font-pixel), monospace",
                fontSize: "0.55rem",
                padding: "0.5rem 0.75rem",
                width: 340,
              }}
              placeholder="https://your-app.vercel.app/join"
            />
            <button
              onClick={() => {
                setPortalUrl(inputUrl)
                localStorage.setItem("poster_url", inputUrl)
                setEditing(false)
              }}
              className="pixel-btn"
              style={{ background: "#00ff88", color: "#000", border: "3px solid #000", fontSize: "0.55rem", padding: "0.5rem 0.75rem" }}
            >
              SAVE
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "0.5rem", color: "#666" }}>QR → {portalUrl}</span>
            <button
              onClick={() => { setEditing(true); setInputUrl(portalUrl) }}
              className="pixel-btn"
              style={{ background: "#1a1a4e", color: "#888", border: "3px solid #444", fontSize: "0.5rem", padding: "0.4rem 0.75rem" }}
            >
              EDIT URL
            </button>
            <button
              onClick={() => window.print()}
              className="pixel-btn"
              style={{ background: "#ffd700", color: "#000", border: "3px solid #000", fontSize: "0.5rem", padding: "0.4rem 0.75rem" }}
            >
              🖨 PRINT / SAVE
            </button>
          </>
        )}
      </div>

      {/* THE POSTER */}
      <div id="poster" style={{
        width: 540,
        minHeight: 760,
        background: "linear-gradient(160deg, #0d0d2b 0%, #1a0a3e 40%, #0d0d2b 100%)",
        border: "8px solid #ffd700",
        boxShadow: "0 0 0 4px #b8860b, 0 0 60px rgba(255,215,0,0.3), inset 0 0 40px rgba(0,0,80,0.5)",
        position: "relative",
        overflow: "hidden",
        padding: "0",
        fontFamily: "var(--font-pixel), monospace",
        imageRendering: "pixelated",
      }}>
        {/* Decorative corner pieces */}
        {[
          { top: -2, left: -2 },
          { top: -2, right: -2 },
          { bottom: -2, left: -2 },
          { bottom: -2, right: -2 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 24,
            height: 24,
            background: "#ffd700",
            ...pos,
            zIndex: 10,
          }} />
        ))}

        {/* Stars */}
        {mounted && STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: "rgba(255,255,255,0.7)",
          }} />
        ))}

        {/* Top decorative bar */}
        <div style={{
          background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)",
          height: 8,
          width: "100%",
        }} />

        {/* Inner border */}
        <div style={{
          margin: "12px",
          border: "3px solid rgba(255,215,0,0.4)",
          padding: "1.5rem 1.25rem 1.25rem",
          minHeight: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}>

          {/* Date badge — top right */}
          <div style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            border: "3px solid #ffd700",
            padding: "0.4rem 0.6rem",
            fontSize: "0.45rem",
            color: "#ffd700",
            lineHeight: 1.8,
            textAlign: "right",
            background: "rgba(0,0,40,0.7)",
          }}>
            APR 25, 2026<br />
            6:00 PM – LATE<br />
            DRUM ASIA LIVE<br />
            HARTAMAS, KL
          </div>

          {/* Clock icon top-left */}
          <div style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            width: 40,
            height: 40,
            border: "3px solid rgba(255,215,0,0.5)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}>⊕</div>

          {/* Main title */}
          <div style={{ textAlign: "center", marginTop: "0.5rem", marginBottom: "0.5rem" }}>
            <div style={{
              fontSize: "0.5rem",
              color: "#aaa",
              letterSpacing: "0.4em",
              marginBottom: "0.4rem",
            }}>✦ EIZAZ&apos;S ✦</div>

            <div style={{
              fontSize: "clamp(3rem, 12vw, 4.5rem)",
              color: "#ffd700",
              textShadow: "6px 6px 0 #7a5800, 0 0 40px rgba(255,215,0,0.6)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
            }}>
              LEVEL
            </div>
            <div style={{
              fontSize: "clamp(4rem, 16vw, 6rem)",
              color: "#ffd700",
              textShadow: "6px 6px 0 #7a5800, 0 0 60px rgba(255,215,0,0.8)",
              lineHeight: 0.85,
            }}>
              40
            </div>
          </div>

          {/* INSERT COIN banner */}
          <div style={{
            background: "linear-gradient(90deg, #7a5800, #b8860b, #ffd700, #b8860b, #7a5800)",
            padding: "0.4rem 2rem",
            marginBottom: "0.75rem",
            border: "3px solid #ffd700",
            boxShadow: "0 0 20px rgba(255,215,0,0.4)",
          }}>
            <span style={{ fontSize: "1.1rem", color: "#000", letterSpacing: "0.15em" }}>
              INSERT COIN
            </span>
          </div>

          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "1.25rem", letterSpacing: "0.15em" }}>
            A 40TH BIRTHDAY LIVE SESSION
          </div>

          {/* Scene — pixel band illustration (CSS art) */}
          <div style={{
            width: "100%",
            height: 100,
            position: "relative",
            marginBottom: "1rem",
            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,40,0.3) 100%)",
          }}>
            {/* Stage lights */}
            {[20, 50, 80].map((x, i) => (
              <div key={i} style={{
                position: "absolute",
                top: 0,
                left: `${x}%`,
                width: 0,
                height: 0,
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderTop: `90px solid rgba(${i === 1 ? "255,215,0" : i === 0 ? "100,150,255" : "150,100,255"},0.12)`,
                transform: "translateX(-50%)",
              }} />
            ))}

            {/* Pixel characters on stage */}
            {/* Drummer */}
            <PixelChar x={38} y={20} color="#ff8844" size={10} label="🥁" />
            {/* Keys */}
            <PixelChar x={22} y={28} color="#4488ff" size={9} label="🎹" />
            {/* Guitar */}
            <PixelChar x={62} y={25} color="#44ff88" size={9} label="🎸" />
            {/* Bass */}
            <PixelChar x={75} y={32} color="#ff44cc" size={8} label="🎸" />
            {/* Singer (center, larger) */}
            <PixelChar x={50} y={45} color="#ffd700" size={14} label="🎤" glow />

            {/* LET'S JAM sign */}
            <div style={{
              position: "absolute",
              top: 2,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.7)",
              border: "2px solid #ffd700",
              padding: "0.2rem 0.5rem",
              fontSize: "0.5rem",
              color: "#ffd700",
              whiteSpace: "nowrap",
            }}>
              LET&apos;S JAM!
            </div>
          </div>

          {/* Activity tags */}
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "1.25rem",
            fontSize: "0.4rem",
            color: "#888",
          }}>
            {["LIVE MUSIC", "VR STATION", "ALCOHOL", "CIGARS", "CHAOS"].map(tag => (
              <span key={tag} style={{ border: "2px solid #333", padding: "0.2rem 0.4rem" }}>• {tag}</span>
            ))}
          </div>

          {/* QR Code — the star of the show */}
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div style={{
              fontSize: "0.5rem",
              color: "#ffd700",
              marginBottom: "0.6rem",
              letterSpacing: "0.15em",
            }}>
              ▼ SCAN TO JOIN THE PARTY ▼
            </div>

            <div style={{
              display: "inline-block",
              padding: "12px",
              background: "#ffd700",
              border: "6px solid #0d0d2b",
              boxShadow: "6px 6px 0 0 #b8860b, 0 0 30px rgba(255,215,0,0.5)",
            }}>
              {mounted && (
                <QRCodeCanvas url={portalUrl} size={180} />
              )}
              {!mounted && (
                <div style={{ width: 180, height: 180, background: "#0d0d2b" }} />
              )}
            </div>

            <div style={{ fontSize: "0.45rem", color: "#888", marginTop: "0.6rem" }}>
              SIGN UP AS MUSICIAN OR SINGER
            </div>
            <div style={{ fontSize: "0.4rem", color: "#555", marginTop: "0.2rem" }}>
              {portalUrl}
            </div>
          </div>

          {/* Power-up station hint */}
          <div style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            justifyContent: "center",
          }}>
            {[
              { label: "1UP", color: "#4488ff", desc: "REGISTER" },
              { label: "BOSS\nFIGHT", color: "#ff8844", desc: "PERFORM" },
              { label: "FINAL\nSTAGE", color: "#44ff88", desc: "VOTE" },
            ].map(item => (
              <div key={item.label} style={{ textAlign: "center" }}>
                <div style={{
                  width: 36,
                  height: 36,
                  border: `3px solid ${item.color}`,
                  background: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.45rem",
                  color: item.color,
                  margin: "0 auto 0.25rem",
                  lineHeight: 1.3,
                  whiteSpace: "pre",
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: "0.35rem", color: "#555" }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <div style={{
            borderTop: "3px solid rgba(255,215,0,0.3)",
            paddingTop: "0.75rem",
            width: "100%",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "0.55rem", color: "#ffd700", marginBottom: "0.25rem" }}>
              40 LEVELS. 2 WORLDS. 1 LEGENDARY NIGHT.
            </div>
            <div style={{ fontSize: "0.38rem", color: "#666", lineHeight: 1.8 }}>
              &quot;I GREW UP ON CARTRIDGES AND CATHODE RAYS.<br />
              TONIGHT, WE&apos;RE RUNNING IT BACK — JUST HIGHER RESOLUTION.&quot;
            </div>
          </div>

          {/* Character row footer */}
          <div style={{
            marginTop: "0.75rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            {[
              { name: "CHRONO", hp: "404/404", mp: "40/40", color: "#4488ff" },
              { name: "AYLA", hp: "400/400", mp: "40/40", color: "#ff88aa" },
              { name: "LUCCA", hp: "380/380", mp: "40/40", color: "#ffaa44" },
              { name: "ROBO", hp: "420/420", mp: "40/40", color: "#44ff88" },
            ].map(c => (
              <div key={c.name} style={{
                border: `2px solid ${c.color}`,
                padding: "0.3rem 0.4rem",
                fontSize: "0.35rem",
                textAlign: "center",
                background: "rgba(0,0,0,0.4)",
                minWidth: 60,
              }}>
                <div style={{ width: 12, height: 12, background: c.color, margin: "0 auto 3px", border: "1px solid #000" }} />
                <div style={{ color: c.color }}>{c.name}</div>
                <div style={{ color: "#0f0" }}>HP {c.hp}</div>
                <div style={{ color: "#44f" }}>MP {c.mp}</div>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom decorative bar */}
        <div style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)",
          height: 8,
        }} />
      </div>

      {/* Instructions */}
      <div className="no-print" style={{ fontSize: "0.45rem", color: "#444", textAlign: "center", lineHeight: 2, maxWidth: 480 }}>
        SET THE URL ABOVE TO YOUR VERCEL DEPLOYMENT LINK<br />
        THEN HIT PRINT / SAVE TO EXPORT AS PDF OR IMAGE<br />
        BEST PRINTED AT A3 (420×297mm)
      </div>
    </div>
  )
}

function PixelChar({
  x, y, color, size, label, glow,
}: {
  x: number; y: number; color: string; size: number; label: string; glow?: boolean
}) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    }}>
      {/* Body */}
      <div style={{
        width: size,
        height: size,
        background: color,
        border: "2px solid #000",
        margin: "0 auto 2px",
        boxShadow: glow ? `0 0 12px ${color}` : undefined,
      }} />
      {/* Head */}
      <div style={{
        width: size * 0.7,
        height: size * 0.7,
        background: color,
        border: "2px solid #000",
        margin: "0 auto 1px",
      }} />
      <div style={{ fontSize: size * 0.9, lineHeight: 1 }}>{label}</div>
    </div>
  )
}

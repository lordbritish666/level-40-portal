"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"

const QRCodeCanvas = dynamic(() => import("./QRCode"), { ssr: false })

export default function PosterPage() {
  const [portalUrl, setPortalUrl] = useState("")
  const [editing, setEditing] = useState(false)
  const [inputUrl, setInputUrl] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("poster_url")
    const origin = window.location.origin
    const defaultUrl = saved || origin
    setPortalUrl(defaultUrl)
    setInputUrl(defaultUrl)
  }, [])

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050510",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem 1rem",
      gap: "1rem",
    }}>

      {/* Controls */}
      <div className="no-print" style={{
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        {editing ? (
          <>
            <input
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              autoFocus
              style={{
                background: "#0a0a3e",
                border: "3px solid #ffd700",
                color: "#ffd700",
                fontFamily: "var(--font-pixel), monospace",
                fontSize: "0.5rem",
                padding: "0.5rem 0.75rem",
                width: 320,
                outline: "none",
              }}
              placeholder="https://level-40-portal.vercel.app/join"
            />
            <button
              onClick={() => {
                setPortalUrl(inputUrl)
                localStorage.setItem("poster_url", inputUrl)
                setEditing(false)
              }}
              className="pixel-btn"
              style={{ background: "#00ff88", color: "#000", border: "3px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
            >
              SAVE
            </button>
            <button
              onClick={() => setEditing(false)}
              className="pixel-btn"
              style={{ background: "#333", color: "#888", border: "3px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
            >
              CANCEL
            </button>
          </>
        ) : (
          <>
            <span style={{ fontSize: "0.45rem", color: "#555", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              QR → {portalUrl}
            </span>
            <button
              onClick={() => { setEditing(true); setInputUrl(portalUrl) }}
              className="pixel-btn"
              style={{ background: "#1a1a4e", color: "#888", border: "3px solid #333", fontSize: "0.45rem", padding: "0.35rem 0.6rem" }}
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

      {/* POSTER — image + QR overlay */}
      <div
        id="poster"
        style={{
          position: "relative",
          width: "min(480px, 92vw)",
          aspectRatio: "480 / 720",
          fontFamily: "var(--font-pixel), monospace",
          imageRendering: "pixelated",
          flexShrink: 0,
        }}
      >
        {/* Actual poster image */}
        <Image
          src="/poster.jpg"
          alt="Level 40 Unlocked"
          fill
          style={{ objectFit: "cover", imageRendering: "pixelated" }}
          priority
        />

        {/* QR overlay — replaces the JOIN THE PARTY dialog box */}
        <div style={{
          position: "absolute",
          top: "60%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          background: "rgba(8, 8, 32, 0.95)",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "3px 3px 0 0 rgba(0,0,0,0.8)",
          padding: "0.6rem 0.75rem 0.65rem",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "0.38rem", color: "#fff", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
            ▶ SCAN TO JOIN THE PARTY
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.4rem", lineHeight: 0 }}>
            <div style={{ background: "#ffd700", padding: 6, border: "2px solid #000" }}>
              {mounted && portalUrl ? (
                <QRCodeCanvas url={portalUrl} size={360} />
              ) : (
                <div style={{ width: 360, height: 360, background: "#0d0d2b" }} />
              )}
            </div>
          </div>

          <div style={{ color: "#ffd700", fontSize: "0.35rem", marginBottom: "0.15rem" }}>
            ☞ MUSICIAN OR SINGER
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.27rem", wordBreak: "break-all" }}>
            {portalUrl || "level-40-portal.vercel.app"}
          </div>
        </div>

        {/* CONTINUE? Y/N badge — matches original poster position, bottom-right of dialog */}
        <div style={{
          position: "absolute",
          top: "86%",
          right: "4%",
          background: "rgba(8, 8, 32, 0.92)",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "3px 3px 0 0 rgba(0,0,0,0.8)",
          padding: "0.3rem 0.45rem",
          fontSize: "0.32rem",
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.8,
        }}>
          CONTINUE?<br />Y / N
        </div>
      </div>

      {/* Print hint */}
      <div className="no-print" style={{ fontSize: "0.4rem", color: "#333", textAlign: "center", lineHeight: 2 }}>
        PRINT AT A3 FOR BEST RESULTS · RIGHT-CLICK → SAVE IMAGE AS FALLBACK
      </div>
    </div>
  )
}

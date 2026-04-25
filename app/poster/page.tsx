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
    const defaultUrl = saved || `${origin}/join`
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
        {/* Positioned at ~62% from top, centered, ~54% wide — matches dialog area */}
        <div style={{
          position: "absolute",
          top: "62%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "54%",
          background: "rgba(8, 8, 32, 0.92)",
          border: "3px solid rgba(255,255,255,0.85)",
          boxShadow: "3px 3px 0 0 rgba(0,0,0,0.8)",
          padding: "0.6rem 0.75rem 0.5rem",
        }}>
          {/* Dialog header */}
          <div style={{ fontSize: "0.38rem", color: "#fff", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
            ▶ SCAN TO JOIN THE PARTY
          </div>

          {/* QR + side text layout */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {/* QR code */}
            <div style={{
              background: "#ffd700",
              padding: 5,
              border: "2px solid #000",
              flexShrink: 0,
              lineHeight: 0,
            }}>
              {mounted && portalUrl ? (
                <QRCodeCanvas url={portalUrl} size={80} />
              ) : (
                <div style={{ width: 80, height: 80, background: "#0d0d2b" }} />
              )}
            </div>

            {/* Side text */}
            <div style={{ fontSize: "0.32rem", color: "#fff", lineHeight: 2 }}>
              <div style={{ color: "#ffd700", marginBottom: "0.2rem", fontSize: "0.35rem" }}>
                ☞ MUSICIAN
              </div>
              <div style={{ color: "#ffd700", marginBottom: "0.4rem", fontSize: "0.35rem" }}>
                &nbsp;&nbsp;OR SINGER
              </div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.28rem", lineHeight: 1.6, wordBreak: "break-all" }}>
                {portalUrl || "level-40-portal.vercel.app/join"}
              </div>
            </div>
          </div>
        </div>

        {/* CONTINUE? Y/N badge — matches original poster position, bottom-right of dialog */}
        <div style={{
          position: "absolute",
          top: "82%",
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

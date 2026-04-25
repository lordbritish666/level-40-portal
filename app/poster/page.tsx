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

      {/* POSTER + QR — stacked layout */}
      <div id="poster" style={{ width: "min(480px, 92vw)", fontFamily: "var(--font-pixel), monospace", flexShrink: 0 }}>

        {/* Poster image */}
        <div style={{ lineHeight: 0, border: "4px solid #ffd700", borderBottom: "none" }}>
          <Image
            src="/poster.jpg"
            alt="Level 40 Unlocked"
            width={480}
            height={720}
            style={{ width: "100%", height: "auto", display: "block", imageRendering: "pixelated" }}
            priority
          />
        </div>

        {/* QR strip below poster */}
        <div style={{
          background: "#080820",
          border: "4px solid #ffd700",
          padding: "1.25rem 1rem",
          display: "flex",
          alignItems: "center",
          gap: "1.25rem",
        }}>
          <div style={{ background: "#ffd700", padding: 8, border: "3px solid #000", lineHeight: 0, flexShrink: 0 }}>
            {mounted && portalUrl ? (
              <QRCodeCanvas url={portalUrl} size={200} />
            ) : (
              <div style={{ width: 200, height: 200, background: "#0d0d2b" }} />
            )}
          </div>
          <div>
            <div style={{ fontSize: "0.55rem", color: "#ffd700", marginBottom: "0.5rem", lineHeight: 1.6 }}>
              ▶ SCAN TO<br />JOIN THE PARTY
            </div>
            <div style={{ fontSize: "0.4rem", color: "#aaa", marginBottom: "0.4rem", lineHeight: 1.8 }}>
              ☞ SIGN UP AS<br />MUSICIAN OR SINGER
            </div>
            <div style={{ fontSize: "0.3rem", color: "#555", wordBreak: "break-all" }}>
              {portalUrl || "level-40-portal.vercel.app"}
            </div>
          </div>
        </div>

      </div>

      {/* Print hint */}
      <div className="no-print" style={{ fontSize: "0.4rem", color: "#333", textAlign: "center", lineHeight: 2 }}>
        PRINT AT A3 FOR BEST RESULTS · RIGHT-CLICK → SAVE IMAGE AS FALLBACK
      </div>
    </div>
  )
}

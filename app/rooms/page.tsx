"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const ROOMS = [
  { id: "overworld", file: "/rooms/overworld.png", name: "THE OVERWORLD STAGE" },
  { id: "entrance-room", file: "/rooms/entrance-room.png", name: "ENTRANCE ROOM" },
  { id: "loot-drops", file: "/rooms/loot-drops.png", name: "LOOT DROPS" },
  { id: "inn-tavern", file: "/rooms/inn-tavern.png", name: "THE INN & TAVERN" },
  { id: "side-room-a", file: "/rooms/side-room-a.png", name: "ENTER THE ISEKAI" },
  { id: "save-point", file: "/rooms/save-point.png", name: "THE SAVE POINT" },
  { id: "scholar-study", file: "/rooms/scholar-study.png", name: "THE SCHOLAR'S STUDY" },
]

export default function RoomsPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div style={{ minHeight: "100vh", background: "#050510" }}>

      <div style={{
        textAlign: "center",
        padding: "2rem 1rem 1.5rem",
        borderBottom: "3px solid rgba(255,215,0,0.2)",
        position: "sticky",
        top: 0,
        background: "rgba(5,5,16,0.95)",
        zIndex: 10,
        backdropFilter: "blur(4px)",
      }}>
        <Link href="/" style={{ fontSize: "0.4rem", color: "#555", textDecoration: "none", display: "block", marginBottom: "0.5rem" }}>
          ← BACK
        </Link>
        <div style={{ fontSize: "0.45rem", color: "#888", letterSpacing: "0.4em", marginBottom: "0.3rem" }}>
          ✦ DRUM ASIA LIVE · HARTAMAS ✦
        </div>
        <div style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "3px 3px 0 #7a5800" }}>
          VENUE MAP
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        {ROOMS.map(r => (
          <div key={r.id} onClick={() => setLightbox(r.file)} style={{ position: "relative", cursor: "zoom-in", overflow: "hidden" }}>
            <Image
              src={r.file}
              alt={r.name}
              width={900}
              height={1200}
              style={{ width: "100%", height: "auto", display: "block", imageRendering: "pixelated", transition: "transform 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.4rem", color: "#333" }}>
        TAP ANY POSTER TO VIEW FULL SIZE
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: "1rem",
        }}>
          <div style={{ position: "relative", maxWidth: "min(560px, 95vw)", maxHeight: "95vh" }}>
            <Image
              src={lightbox}
              alt="room poster"
              width={900}
              height={1200}
              style={{ width: "100%", height: "auto", maxHeight: "95vh", objectFit: "contain", imageRendering: "pixelated", display: "block", border: "4px solid #ffd700", boxShadow: "0 0 60px rgba(255,215,0,0.3)" }}
            />
            <button style={{
              position: "absolute", top: -16, right: -16, background: "#ffd700", color: "#000",
              border: "3px solid #000", width: 32, height: 32, fontFamily: "var(--font-pixel), monospace",
              fontSize: "0.5rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

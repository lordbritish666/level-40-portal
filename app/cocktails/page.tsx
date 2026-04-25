"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

const cocktails = [
  {
    id: "phoenix-down",
    file: "/cocktails/phoenix-down.jpg",
    name: "PHOENIX DOWN",
    subtitle: "Corpse Reviver No. 1",
    tagline: "REVIVE. RESET. GO AGAIN.",
    color: "#ff8844",
  },
  {
    id: "hp-tonic",
    file: "/cocktails/hp-tonic.jpg",
    name: "HP TONIC",
    subtitle: "Gin & Tonic",
    tagline: "HEAL. HYDRATE. KEEP GOING.",
    color: "#44ff88",
  },
  {
    id: "peaceful-days",
    file: "/cocktails/peaceful-days.jpg",
    name: "PEACEFUL DAYS",
    subtitle: "Piña Colada",
    tagline: "REST. RELAX. FULL CHILL.",
    color: "#ffdd44",
  },
  {
    id: "mp-refill",
    file: "/cocktails/mp-refill.jpg",
    name: "MP REFILL",
    subtitle: "Mocktail",
    tagline: "RECHARGE. RECAST. REPEAT.",
    color: "#dd44ff",
  },
]

export default function CocktailsPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div style={{ minHeight: "100vh", background: "#050510" }}>

      {/* Header */}
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
          ✦ LEVEL 40 COCKTAIL SERIES ✦
        </div>
        <div style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "3px 3px 0 #7a5800" }}>
          POWER-UP STATION
        </div>
      </div>

      {/* Poster grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        gap: "0",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        {cocktails.map((c) => (
          <div
            key={c.id}
            onClick={() => setLightbox(c.file)}
            style={{
              position: "relative",
              cursor: "zoom-in",
              overflow: "hidden",
              borderBottom: `4px solid ${c.color}22`,
            }}
          >
            <Image
              src={c.file}
              alt={c.name}
              width={900}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                imageRendering: "pixelated",
                transition: "transform 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
            {/* Hover label */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(transparent, rgba(0,0,0,0.85))`,
              padding: "2rem 1rem 0.75rem",
              opacity: 0,
              transition: "opacity 0.2s",
              pointerEvents: "none",
              fontFamily: "var(--font-pixel), monospace",
            }}
              className="poster-label"
            >
              <div style={{ fontSize: "0.55rem", color: c.color }}>{c.name}</div>
              <div style={{ fontSize: "0.4rem", color: "#aaa", marginTop: "0.2rem" }}>{c.tagline}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tap hint */}
      <div style={{ textAlign: "center", padding: "1.5rem", fontSize: "0.4rem", color: "#333" }}>
        TAP ANY POSTER TO VIEW FULL SIZE
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            padding: "1rem",
          }}
        >
          <div style={{ position: "relative", maxWidth: "min(560px, 95vw)", maxHeight: "95vh" }}>
            <Image
              src={lightbox}
              alt="cocktail poster"
              width={900}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "95vh",
                objectFit: "contain",
                imageRendering: "pixelated",
                display: "block",
                border: "4px solid #ffd700",
                boxShadow: "0 0 60px rgba(255,215,0,0.3)",
              }}
            />
            <button
              style={{
                position: "absolute",
                top: -16,
                right: -16,
                background: "#ffd700",
                color: "#000",
                border: "3px solid #000",
                width: 32,
                height: 32,
                fontFamily: "var(--font-pixel), monospace",
                fontSize: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style>{`
        .poster-label { opacity: 0; }
        div:hover > .poster-label { opacity: 1; }
      `}</style>
    </div>
  )
}

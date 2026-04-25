"use client"
import { useState } from "react"
import Link from "next/link"
import type { Instrument } from "@/lib/types"
import { INSTRUMENT_LABELS, INSTRUMENT_ICONS } from "@/lib/types"

const INSTRUMENTS: Instrument[] = ["bass", "drums", "keys", "guitar", "misc"]

export default function MusicianRegisterPage() {
  const [name, setName] = useState("")
  const [instrument, setInstrument] = useState<Instrument | null>(null)
  const [canSing, setCanSing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !instrument) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/musicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), instrument, canSing }),
      })
      if (!res.ok) throw new Error(await res.text())
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="pixel-card text-center" style={{ maxWidth: 400, width: "100%", padding: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✓</div>
          <div style={{ fontSize: "0.9rem", color: "#00ff88", marginBottom: "1rem" }}>
            REGISTERED!
          </div>
          <div style={{ fontSize: "0.55rem", color: "#aaa", lineHeight: 2, marginBottom: "2rem" }}>
            {name.toUpperCase()}<br />
            {INSTRUMENT_ICONS[instrument!]} {INSTRUMENT_LABELS[instrument!].toUpperCase()}
          </div>
          <div style={{ fontSize: "0.5rem", color: "#ffd700", marginBottom: "1.5rem" }}>
            YOU&apos;RE IN THE BAND ROSTER.<br />
            AWAIT YOUR CALL TO THE STAGE!
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/stage">
              <button className="pixel-btn" style={{ width: "100%", background: "#00ff88", color: "#000", fontSize: "0.6rem", padding: "0.75rem" }}>
                VIEW STAGE
              </button>
            </Link>
            <Link href="/join">
              <button className="pixel-btn" style={{ width: "100%", background: "#444", color: "#fff", fontSize: "0.6rem", padding: "0.75rem" }}>
                ALSO SIGN UP AS SINGER
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link href="/join" style={{ fontSize: "0.5rem", color: "#888", marginBottom: "2rem", textDecoration: "none" }}>
        ← BACK
      </Link>

      <div className="text-center" style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎸</div>
        <h2 style={{ fontSize: "clamp(0.8rem, 4vw, 1.2rem)", color: "#ffd700", textShadow: "3px 3px 0px #b8860b" }}>
          MUSICIAN SIGN-UP
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 440 }}>
        <div className="pixel-card" style={{ padding: "2rem" }}>

          {/* Name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.55rem", color: "#888", display: "block", marginBottom: "0.5rem" }}>
              YOUR NAME
            </label>
            <input
              className="pixel-input"
              type="text"
              placeholder="ENTER YOUR NAME..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              required
            />
          </div>

          {/* Instrument */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.55rem", color: "#888", display: "block", marginBottom: "0.75rem" }}>
              YOUR INSTRUMENT
            </label>
            <div className="flex flex-col gap-2">
              {INSTRUMENTS.map(inst => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => setInstrument(inst)}
                  className="pixel-btn"
                  style={{
                    background: instrument === inst ? "#ffd700" : "#1a1a4e",
                    color: instrument === inst ? "#000" : "#ffd700",
                    border: `4px solid ${instrument === inst ? "#000" : "#ffd700"}`,
                    boxShadow: instrument === inst ? "4px 4px 0 0 #000" : "4px 4px 0 0 #333",
                    padding: "0.75rem 1rem",
                    fontSize: "0.6rem",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  {INSTRUMENT_ICONS[inst]} {INSTRUMENT_LABELS[inst].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Can sing? */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setCanSing(!canSing)}
              className="pixel-btn"
              style={{
                background: canSing ? "#9944ff" : "#1a1a4e",
                color: canSing ? "#fff" : "#888",
                border: `4px solid ${canSing ? "#9944ff" : "#444"}`,
                boxShadow: `4px 4px 0 0 ${canSing ? "#5500aa" : "#222"}`,
                padding: "0.75rem 1rem",
                fontSize: "0.55rem",
                width: "100%",
              }}
            >
              {canSing ? "✓" : "○"} I CAN ALSO SING
            </button>
          </div>

          {error && (
            <div style={{ fontSize: "0.5rem", color: "#ff4444", marginBottom: "1rem", textAlign: "center" }}>
              ERROR: {error.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !instrument || loading}
            className="pixel-btn"
            style={{
              width: "100%",
              background: !name.trim() || !instrument ? "#333" : "#ffd700",
              color: !name.trim() || !instrument ? "#666" : "#000",
              border: "4px solid #000",
              fontSize: "0.7rem",
              padding: "1rem",
              cursor: !name.trim() || !instrument ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "REGISTERING..." : "JOIN THE ROSTER ▶"}
          </button>
        </div>
      </form>
    </div>
  )
}

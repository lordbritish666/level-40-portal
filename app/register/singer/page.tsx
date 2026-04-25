"use client"
import { useState } from "react"
import Link from "next/link"
import type { Instrument } from "@/lib/types"
import { INSTRUMENT_LABELS, INSTRUMENT_ICONS } from "@/lib/types"

const INSTRUMENTS: Instrument[] = ["bass", "drums", "keys", "guitar", "misc"]

export default function SingerRegisterPage() {
  const [name, setName] = useState("")
  const [songs, setSongs] = useState(["", "", ""])
  const [canPlay, setCanPlay] = useState(false)
  const [instrument, setInstrument] = useState<Instrument | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  function updateSong(index: number, value: string) {
    const updated = [...songs]
    updated[index] = value
    setSongs(updated)
  }

  const isValid = name.trim() && songs[0].trim()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/singers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          songs: songs.map(s => s.trim()).filter(Boolean),
          canPlayInstrument: canPlay,
          instrument: canPlay ? instrument : undefined,
        }),
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
        <div className="pixel-card text-center" style={{ maxWidth: 440, width: "100%", padding: "2.5rem", borderColor: "#00ff88", boxShadow: "8px 8px 0 0 rgba(0,255,136,0.3)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎤</div>
          <div style={{ fontSize: "0.9rem", color: "#00ff88", marginBottom: "1rem" }}>
            QUEUED UP!
          </div>
          <div style={{ fontSize: "0.55rem", color: "#ffd700", marginBottom: "0.5rem" }}>
            {name.toUpperCase()}
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            {songs.filter(Boolean).map((song, i) => (
              <div key={i} style={{ fontSize: "0.5rem", color: "#aaa", lineHeight: 2 }}>
                SONG {i + 1}: {song.toUpperCase()}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "1.5rem", lineHeight: 2 }}>
            THE HOST WILL CALL YOU UP.<br />
            YOUR BAND WILL BE RANDOMIZED.<br />
            GUESTS CAN VOTE FOR YOUR SONGS!
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/stage">
              <button className="pixel-btn" style={{ width: "100%", background: "#00ff88", color: "#000", fontSize: "0.6rem", padding: "0.75rem" }}>
                VIEW STAGE &amp; VOTE
              </button>
            </Link>
            <Link href="/join">
              <button className="pixel-btn" style={{ width: "100%", background: "#444", color: "#fff", fontSize: "0.6rem", padding: "0.75rem" }}>
                ALSO JOIN AS MUSICIAN
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
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎤</div>
        <h2 style={{ fontSize: "clamp(0.8rem, 4vw, 1.2rem)", color: "#00ff88", textShadow: "3px 3px 0px #007744" }}>
          SINGER SIGN-UP
        </h2>
      </div>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 460 }}>
        <div className="pixel-card" style={{ padding: "2rem", borderColor: "#00ff88", boxShadow: "8px 8px 0 0 rgba(0,255,136,0.3)" }}>

          {/* Name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.55rem", color: "#888", display: "block", marginBottom: "0.5rem" }}>
              YOUR NAME
            </label>
            <input
              className="pixel-input"
              style={{ borderColor: "#00ff88" }}
              type="text"
              placeholder="ENTER YOUR NAME..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={30}
              required
            />
          </div>

          {/* Songs */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.55rem", color: "#888", display: "block", marginBottom: "0.5rem" }}>
              YOUR SONG(S)
            </label>
            <div style={{ fontSize: "0.45rem", color: "#666", marginBottom: "0.75rem", lineHeight: 1.8 }}>
              ADD UP TO 3 SONGS — GUESTS VOTE FOR WHICH ONE.<br />
              ONLY SONG 1 IS REQUIRED.
            </div>
            {([0, 1, 2] as const).map(i => (
              <div key={i} style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.45rem", color: i === 0 ? "#888" : "#555", marginBottom: "0.25rem" }}>
                  SONG {i + 1} {i === 0 ? "(REQUIRED)" : "(OPTIONAL)"}
                </div>
                <input
                  className="pixel-input"
                  style={{ borderColor: i === 0 ? "#00ff88" : "#336633", fontSize: "0.6rem" }}
                  type="text"
                  placeholder={i === 0 ? "SONG TITLE..." : `OPTIONAL SONG ${i + 1}...`}
                  value={songs[i]}
                  onChange={e => updateSong(i, e.target.value)}
                  maxLength={60}
                  required={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Can play? */}
          <div style={{ marginBottom: "1.5rem" }}>
            <button
              type="button"
              onClick={() => setCanPlay(!canPlay)}
              className="pixel-btn"
              style={{
                background: canPlay ? "#9944ff" : "#1a1a4e",
                color: canPlay ? "#fff" : "#888",
                border: `4px solid ${canPlay ? "#9944ff" : "#444"}`,
                boxShadow: `4px 4px 0 0 ${canPlay ? "#5500aa" : "#222"}`,
                padding: "0.75rem 1rem",
                fontSize: "0.55rem",
                width: "100%",
              }}
            >
              {canPlay ? "✓" : "○"} I CAN ALSO PLAY AN INSTRUMENT
            </button>

            {canPlay && (
              <div style={{ marginTop: "0.75rem" }}>
                <div style={{ fontSize: "0.45rem", color: "#888", marginBottom: "0.5rem" }}>WHICH INSTRUMENT?</div>
                <div className="flex flex-col gap-2">
                  {INSTRUMENTS.map(inst => (
                    <button
                      key={inst}
                      type="button"
                      onClick={() => setInstrument(inst)}
                      className="pixel-btn"
                      style={{
                        background: instrument === inst ? "#9944ff" : "#1a1a4e",
                        color: instrument === inst ? "#fff" : "#aaa",
                        border: `4px solid ${instrument === inst ? "#9944ff" : "#333"}`,
                        boxShadow: `4px 4px 0 0 ${instrument === inst ? "#5500aa" : "#111"}`,
                        padding: "0.5rem 1rem",
                        fontSize: "0.5rem",
                        textAlign: "left",
                        width: "100%",
                      }}
                    >
                      {INSTRUMENT_ICONS[inst] ?? '🎵'} {(INSTRUMENT_LABELS[inst] ?? inst).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ fontSize: "0.5rem", color: "#ff4444", marginBottom: "1rem", textAlign: "center" }}>
              ERROR: {error.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="pixel-btn"
            style={{
              width: "100%",
              background: !isValid ? "#333" : "#00ff88",
              color: !isValid ? "#666" : "#000",
              border: "4px solid #000",
              fontSize: "0.7rem",
              padding: "1rem",
              cursor: !isValid ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "REGISTERING..." : "JOIN THE QUEUE ▶"}
          </button>
        </div>
      </form>
    </div>
  )
}

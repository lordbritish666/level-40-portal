"use client"
import { useState } from "react"
import Link from "next/link"
import { INSTRUMENT_LABELS, INSTRUMENT_ICONS, instIcon, instLabel } from "@/lib/types"

const PRESET_INSTRUMENTS = ["bass", "drums", "keys", "guitar", "misc"] as const

export default function MusicianRegisterPage() {
  const [name, setName] = useState("")
  const [instruments, setInstruments] = useState<string[]>([])
  const [canSing, setCanSing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [otherInput, setOtherInput] = useState("")
  const [showOther, setShowOther] = useState(false)

  function togglePreset(inst: string) {
    setInstruments(prev =>
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    )
  }

  function addOther() {
    const val = otherInput.trim().toLowerCase()
    if (!val || instruments.includes(val)) { setOtherInput(""); return }
    setInstruments(prev => [...prev, val])
    setOtherInput("")
    setShowOther(false)
  }

  function removeInstrument(inst: string) {
    setInstruments(prev => prev.filter(i => i !== inst))
  }

  const customInstruments = instruments.filter(i => !PRESET_INSTRUMENTS.includes(i as typeof PRESET_INSTRUMENTS[number]))
  const isValid = name.trim() && instruments.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/musicians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), instruments, canSing }),
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
          <div style={{ fontSize: "0.9rem", color: "#00ff88", marginBottom: "1rem" }}>REGISTERED!</div>
          <div style={{ fontSize: "0.55rem", color: "#ffd700", marginBottom: "0.25rem" }}>{name.toUpperCase()}</div>
          <div style={{ fontSize: "0.5rem", color: "#aaa", marginBottom: "1.5rem" }}>
            {instruments.map(i => `${instIcon(i)} ${instLabel(i)}`).join(" · ").toUpperCase()}
          </div>
          <div style={{ fontSize: "0.5rem", color: "#ffd700", marginBottom: "1.5rem" }}>
            YOU&apos;RE IN THE BAND ROSTER.<br />AWAIT YOUR CALL TO THE STAGE!
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

          {/* Instruments — multi-select */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontSize: "0.55rem", color: "#888", display: "block", marginBottom: "0.25rem" }}>
              YOUR INSTRUMENT(S)
            </label>
            <div style={{ fontSize: "0.4rem", color: "#555", marginBottom: "0.75rem" }}>
              SELECT ALL THAT APPLY
            </div>
            <div className="flex flex-col gap-2">
              {PRESET_INSTRUMENTS.map(inst => {
                const selected = instruments.includes(inst)
                return (
                  <button
                    key={inst}
                    type="button"
                    onClick={() => togglePreset(inst)}
                    className="pixel-btn"
                    style={{
                      background: selected ? "#ffd700" : "#1a1a4e",
                      color: selected ? "#000" : "#ffd700",
                      border: `4px solid ${selected ? "#000" : "#ffd700"}`,
                      boxShadow: selected ? "4px 4px 0 0 #000" : "4px 4px 0 0 #333",
                      padding: "0.75rem 1rem",
                      fontSize: "0.6rem",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    {selected ? "✓ " : "○ "}{INSTRUMENT_ICONS[inst]} {INSTRUMENT_LABELS[inst].toUpperCase()}
                  </button>
                )
              })}

              {/* Custom instruments */}
              {customInstruments.map(inst => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => removeInstrument(inst)}
                  className="pixel-btn"
                  style={{
                    background: "#ffd700",
                    color: "#000",
                    border: "4px solid #000",
                    boxShadow: "4px 4px 0 0 #000",
                    padding: "0.75rem 1rem",
                    fontSize: "0.6rem",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  ✓ 🎵 {inst.toUpperCase()} <span style={{ fontSize: "0.45rem", color: "#555", marginLeft: "0.5rem" }}>[TAP TO REMOVE]</span>
                </button>
              ))}

              {/* Add other */}
              {showOther ? (
                <div className="flex gap-2">
                  <input
                    className="pixel-input"
                    style={{ flex: 1, fontSize: "0.55rem" }}
                    placeholder="E.G. TRUMPET, VIOLIN..."
                    value={otherInput}
                    onChange={e => setOtherInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addOther() } }}
                    autoFocus
                    maxLength={30}
                  />
                  <button
                    type="button"
                    onClick={addOther}
                    className="pixel-btn"
                    style={{ background: "#ffd700", color: "#000", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
                  >
                    ADD
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowOther(false); setOtherInput("") }}
                    className="pixel-btn"
                    style={{ background: "#333", color: "#888", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowOther(true)}
                  className="pixel-btn"
                  style={{
                    background: "#0d0d3a",
                    color: "#888",
                    border: "4px dashed #444",
                    boxShadow: "none",
                    padding: "0.6rem 1rem",
                    fontSize: "0.5rem",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  + ADD OTHER INSTRUMENT
                </button>
              )}
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
            disabled={!isValid || loading}
            className="pixel-btn"
            style={{
              width: "100%",
              background: !isValid ? "#333" : "#ffd700",
              color: !isValid ? "#666" : "#000",
              border: "4px solid #000",
              fontSize: "0.7rem",
              padding: "1rem",
              cursor: !isValid ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "REGISTERING..." : "JOIN THE ROSTER ▶"}
          </button>
        </div>
      </form>
    </div>
  )
}

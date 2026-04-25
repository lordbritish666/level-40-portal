"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import type { Musician, Singer, Performance } from "@/lib/types"
import { instIcon, instLabel } from "@/lib/types"

const ADMIN_KEY = "admin_key_level40"

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState("")
  const [singers, setSingers] = useState<Singer[]>([])
  const [musicians, setMusicians] = useState<Musician[]>([])
  const [live, setLive] = useState<Performance | null>(null)
  const [tab, setTab] = useState<"stage" | "roster">("stage")
  const [instrTitle, setInstrTitle] = useState("")
  const [msg, setMsg] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_KEY) === "true") setAuth(true)
  }, [])

  const fetchAll = useCallback(async () => {
    const [mRes, sRes, pRes] = await Promise.all([
      fetch("/api/musicians"),
      fetch("/api/singers"),
      fetch("/api/performances?include=all"),
    ])
    const [m, s, p] = await Promise.all([mRes.json(), sRes.json(), pRes.json()])
    setMusicians(m)
    setSingers(s)
    setLive((p as Performance[]).find((x: Performance) => x.status === "live" || x.status === "wrapping") ?? null)
  }, [])

  useEffect(() => {
    if (auth) {
      fetchAll()
      const t = setInterval(fetchAll, 15000)
      return () => clearInterval(t)
    }
  }, [auth, fetchAll])

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000) }

  async function announce(singerId?: string, title?: string) {
    setBusy(true)
    const res = await fetch("/api/admin/announce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(singerId ? { singerId } : { title }),
    })
    if (res.ok) {
      const perf = await res.json()
      flash(`🎤 NOW ON STAGE: ${perf.singer ? perf.singer.name : perf.title}`)
      setInstrTitle("")
      await fetchAll()
    } else {
      flash("ERROR: " + await res.text())
    }
    setBusy(false)
  }

  async function wrapUp() {
    setBusy(true)
    await fetch("/api/admin/wrap", { method: "POST" })
    await fetchAll()
    setBusy(false)
  }

  async function clearStage() {
    setBusy(true)
    await fetch("/api/admin/clear", { method: "POST" })
    flash("STAGE CLEARED")
    await fetchAll()
    setBusy(false)
  }

  async function toggleAvailable(m: Musician) {
    await fetch("/api/musicians", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, available: !m.available }),
    })
    await fetchAll()
  }

  async function resetAll() {
    if (!confirm("RESET ALL DATA? This cannot be undone.")) return
    await fetch("/api/admin/reset", { method: "POST" })
    flash("ALL DATA RESET")
    await fetchAll()
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="pixel-card" style={{ maxWidth: 360, width: "100%", padding: "2rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#ffd700", marginBottom: "1.5rem", textAlign: "center" }}>🔒 HOST ADMIN</div>
          <input
            className="pixel-input"
            type="password"
            placeholder="PASSWORD..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && password === "666") {
                sessionStorage.setItem(ADMIN_KEY, "true"); setAuth(true)
              }
            }}
            style={{ marginBottom: "1rem" }}
          />
          <button
            className="pixel-btn"
            style={{ width: "100%", background: "#ffd700", color: "#000", fontSize: "0.6rem", padding: "0.75rem" }}
            onClick={() => { if (password === "666") { sessionStorage.setItem(ADMIN_KEY, "true"); setAuth(true) } }}
          >
            ENTER ▶
          </button>
        </div>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#666", marginTop: "1.5rem", textDecoration: "none" }}>← BACK</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6" style={{ maxWidth: 600, margin: "0 auto" }}>

      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none" }}>← HOME</Link>
        <div style={{ fontSize: "0.7rem", color: "#ffd700" }}>🎛️ HOST ADMIN</div>
        <button onClick={fetchAll} style={{ fontSize: "0.45rem", color: "#888", background: "none", border: "none", cursor: "pointer" }}>↻</button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{ padding: "0.75rem", marginBottom: "1rem", fontSize: "0.55rem", color: "#00ff88", textAlign: "center", background: "rgba(0,255,136,0.1)", border: "2px solid #00ff88" }}>
          {msg}
        </div>
      )}

      {/* NOW ON STAGE */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "0.5rem", color: "#ff4444", marginBottom: "0.5rem" }}>
          <span className="blink">●</span> NOW ON STAGE
        </div>
        {live ? (
          <div className="pixel-card march-border" style={{ padding: "1.25rem" }}>
            <div style={{ fontSize: "0.9rem", color: "#ffd700", marginBottom: "0.2rem" }}>
              {live.singer ? live.singer.name : "🎵 INSTRUMENTAL"}
            </div>
            <div style={{ fontSize: "0.6rem", color: "#00ff88", marginBottom: "0.75rem" }}>♪ {live.title}</div>
            <div className="flex flex-wrap gap-2" style={{ marginBottom: "1rem" }}>
              {live.band.map(m => (
                <span key={m.id} className="pixel-panel" style={{ fontSize: "0.4rem", padding: "0.25rem 0.5rem" }}>
                  {m.instruments.map(instIcon).join("")} {m.name}
                </span>
              ))}
              {live.band.length === 0 && <span style={{ fontSize: "0.4rem", color: "#555" }}>NO BAND ASSIGNED</span>}
            </div>
            <div className="flex gap-2">
              {live.status === "live" && (
                <button
                  onClick={wrapUp}
                  disabled={busy}
                  className="pixel-btn"
                  style={{ background: "#888", color: "#000", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 1rem" }}
                >
                  ⏹ WRAP UP
                </button>
              )}
              <button
                onClick={clearStage}
                disabled={busy}
                className="pixel-btn"
                style={{ background: "#ff4444", color: "#fff", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 1rem" }}
              >
                ✕ CLEAR STAGE
              </button>
            </div>
          </div>
        ) : (
          <div className="pixel-card" style={{ padding: "1rem", opacity: 0.4 }}>
            <div style={{ fontSize: "0.5rem", color: "#666", textAlign: "center" }}>STAGE IS EMPTY</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: "1.25rem" }}>
        {(["stage", "roster"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="pixel-btn" style={{
            background: tab === t ? "#ffd700" : "#1a1a4e",
            color: tab === t ? "#000" : "#888",
            border: `4px solid ${tab === t ? "#000" : "#333"}`,
            boxShadow: tab === t ? "4px 4px 0 0 #000" : "none",
            fontSize: "0.5rem", padding: "0.5rem 0.75rem",
          }}>
            {t === "stage" ? "🎤 CALL TO STAGE" : "🎸 ROSTER"}
          </button>
        ))}
      </div>

      {/* STAGE TAB */}
      {tab === "stage" && (
        <div className="flex flex-col gap-3">

          {/* Singers */}
          {singers.map(s => (
            <div key={s.id} className="pixel-card" style={{ padding: "1rem", borderColor: "#2a2a5e" }}>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: "0.6rem", color: "#ffd700" }}>🎤 {s.name}</div>
                  <div style={{ fontSize: "0.38rem", color: "#555", marginTop: "0.2rem" }}>
                    {s.songs.filter(Boolean).join(" · ")}
                  </div>
                </div>
                <button
                  onClick={() => announce(s.id)}
                  disabled={busy}
                  className="pixel-btn"
                  style={{ background: "#00ff88", color: "#000", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem", flexShrink: 0 }}
                >
                  ▶ ANNOUNCE
                </button>
              </div>
            </div>
          ))}

          {singers.length === 0 && (
            <div style={{ fontSize: "0.45rem", color: "#444" }}>NO SINGERS REGISTERED YET</div>
          )}

          {/* Instrumental */}
          <div className="pixel-card" style={{ padding: "1rem", borderColor: "#4488ff" }}>
            <div style={{ fontSize: "0.5rem", color: "#4488ff", marginBottom: "0.6rem" }}>🎵 INSTRUMENTAL</div>
            <div className="flex gap-2">
              <input
                className="pixel-input"
                style={{ flex: 1, borderColor: "#4488ff", fontSize: "0.5rem" }}
                placeholder="SET TITLE..."
                value={instrTitle}
                onChange={e => setInstrTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && instrTitle.trim() && announce(undefined, instrTitle)}
              />
              <button
                onClick={() => announce(undefined, instrTitle)}
                disabled={busy || !instrTitle.trim()}
                className="pixel-btn"
                style={{ background: "#4488ff", color: "#fff", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem", flexShrink: 0 }}
              >
                ▶ ANNOUNCE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROSTER TAB */}
      {tab === "roster" && (
        <div className="flex flex-col gap-2">
          <div style={{ fontSize: "0.45rem", color: "#888", marginBottom: "0.25rem" }}>
            TAP TO TOGGLE AVAILABILITY
          </div>
          {musicians.length === 0 && <div style={{ fontSize: "0.45rem", color: "#444" }}>NO MUSICIANS YET</div>}
          {musicians.map(m => (
            <div key={m.id} className="pixel-card" style={{ padding: "0.9rem", borderColor: m.available ? "#ffd700" : "#333" }}>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontSize: "0.55rem", color: m.available ? "#ffd700" : "#666" }}>
                    {m.instruments.map(instIcon).join("")} {m.name}
                  </div>
                  <div style={{ fontSize: "0.38rem", color: "#555" }}>
                    {m.instruments.map(instLabel).join(" · ")}
                  </div>
                </div>
                <button
                  onClick={() => toggleAvailable(m)}
                  className="pixel-btn"
                  style={{
                    background: m.available ? "#ffd700" : "#333",
                    color: m.available ? "#000" : "#666",
                    border: "4px solid #000", fontSize: "0.45rem", padding: "0.4rem 0.6rem",
                  }}
                >
                  {m.available ? "IN" : "OUT"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Danger zone */}
      <div style={{ marginTop: "3rem", paddingTop: "1rem", borderTop: "2px solid #1a1a1a" }}>
        <button
          onClick={resetAll}
          style={{ fontSize: "0.4rem", color: "#ff4444", background: "none", border: "2px solid #ff4444", padding: "0.5rem 0.75rem", cursor: "pointer" }}
        >
          ⚠ RESET ALL DATA
        </button>
      </div>
    </div>
  )
}

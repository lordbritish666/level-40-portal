"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import type { Musician, Singer, Performance } from "@/lib/types"
import { INSTRUMENT_ICONS, INSTRUMENT_LABELS } from "@/lib/types"

interface AdminData {
  musicians: Musician[]
  singers: Singer[]
  performances: Performance[]
}

const ADMIN_KEY = "admin_key_level40"

export default function AdminPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState("")
  const [data, setData] = useState<AdminData>({ musicians: [], singers: [], performances: [] })
  const [loading, setLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState("")
  const [tab, setTab] = useState<"stage" | "roster" | "singers">("stage")

  // Simple client-side auth
  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_KEY) === "true") setAuth(true)
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [mRes, sRes, pRes] = await Promise.all([
        fetch("/api/musicians"),
        fetch("/api/singers"),
        fetch("/api/performances"),
      ])
      const [musicians, singers, performances] = await Promise.all([mRes.json(), sRes.json(), pRes.json()])
      setData({ musicians, singers, performances })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (auth) {
      fetchAll()
      const interval = setInterval(fetchAll, 15000)
      return () => clearInterval(interval)
    }
  }, [auth, fetchAll])

  function flash(msg: string) {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(""), 3000)
  }

  async function callToStage(singer: Singer) {
    const res = await fetch("/api/admin/call-to-stage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ singerId: singer.id }),
    })
    if (res.ok) {
      flash(`${singer.name} CALLED TO STAGE!`)
      await fetchAll()
    } else {
      flash("ERROR: " + (await res.text()))
    }
  }

  async function markDone(performanceId: string) {
    const res = await fetch("/api/admin/mark-done", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ performanceId }),
    })
    if (res.ok) {
      flash("PERFORMANCE MARKED DONE")
      await fetchAll()
    }
  }

  async function toggleAvailable(musician: Musician) {
    const res = await fetch("/api/musicians", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: musician.id, available: !musician.available }),
    })
    if (res.ok) {
      flash(`${musician.name} ${!musician.available ? "SET AVAILABLE" : "SET UNAVAILABLE"}`)
      await fetchAll()
    }
  }

  async function callToStageWithSong(performanceId: string, songIndex: number) {
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ performanceId, songIndex }),
    })
    if (res.ok) {
      flash("CALLED TO STAGE!")
      await fetchAll()
    }
  }

  async function resetAll() {
    if (!confirm("RESET ALL DATA? This cannot be undone.")) return
    const res = await fetch("/api/admin/reset", { method: "POST" })
    if (res.ok) {
      flash("ALL DATA RESET")
      await fetchAll()
    }
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="pixel-card" style={{ maxWidth: 360, width: "100%", padding: "2rem" }}>
          <div style={{ fontSize: "0.8rem", color: "#ffd700", marginBottom: "1.5rem", textAlign: "center" }}>
            🔒 HOST ADMIN
          </div>
          <input
            className="pixel-input"
            type="password"
            placeholder="PASSWORD..."
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && password === "level40") {
                sessionStorage.setItem(ADMIN_KEY, "true")
                setAuth(true)
              }
            }}
            style={{ marginBottom: "1rem" }}
          />
          <button
            className="pixel-btn"
            style={{ width: "100%", background: "#ffd700", color: "#000", fontSize: "0.6rem", padding: "0.75rem" }}
            onClick={() => {
              if (password === "level40") {
                sessionStorage.setItem(ADMIN_KEY, "true")
                setAuth(true)
              }
            }}
          >
            ENTER ▶
          </button>
          <div style={{ fontSize: "0.4rem", color: "#444", marginTop: "1rem", textAlign: "center" }}>
            DEFAULT: level40
          </div>
        </div>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#666", marginTop: "1.5rem", textDecoration: "none" }}>← BACK</Link>
      </div>
    )
  }

  const live = data.performances.find(p => p.status === "live")
  const queued = data.performances.filter(p => p.status === "queued")
  const done = data.performances.filter(p => p.status === "done")
  const singersDone = new Set(data.performances.map(p => p.singer.id))
  const singersNotQueued = data.singers.filter(s => !singersDone.has(s.id))

  return (
    <div className="min-h-screen px-4 py-6" style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none" }}>← HOME</Link>
        <div style={{ fontSize: "0.7rem", color: "#ffd700" }}>🎛️ HOST ADMIN</div>
        <button
          onClick={fetchAll}
          style={{ fontSize: "0.45rem", color: "#888", background: "none", border: "none", cursor: "pointer" }}
        >
          ↻ REFRESH
        </button>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="pixel-border-green" style={{ padding: "0.75rem", marginBottom: "1rem", fontSize: "0.55rem", color: "#00ff88", textAlign: "center", background: "rgba(0,255,136,0.1)" }}>
          ✓ {actionMsg}
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-3 flex-wrap" style={{ marginBottom: "1.5rem" }}>
        {[
          { label: "MUSICIANS", val: data.musicians.length, color: "#ffd700" },
          { label: "SINGERS", val: data.singers.length, color: "#00ff88" },
          { label: "PERFORMED", val: done.length, color: "#888" },
          { label: "IN QUEUE", val: queued.length, color: "#ffaa44" },
        ].map(s => (
          <div key={s.label} className="pixel-panel" style={{ padding: "0.5rem 0.75rem", flex: 1, minWidth: 80, textAlign: "center" }}>
            <div style={{ fontSize: "1rem", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "0.4rem", color: "#666" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2" style={{ marginBottom: "1.25rem" }}>
        {(["stage", "roster", "singers"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="pixel-btn"
            style={{
              background: tab === t ? "#ffd700" : "#1a1a4e",
              color: tab === t ? "#000" : "#888",
              border: `4px solid ${tab === t ? "#000" : "#333"}`,
              boxShadow: tab === t ? "4px 4px 0 0 #000" : "none",
              fontSize: "0.5rem",
              padding: "0.5rem 0.75rem",
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* STAGE TAB */}
      {tab === "stage" && (
        <div>
          {/* Live now */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.5rem", color: "#ff4444", marginBottom: "0.5rem" }}>
              <span className="blink">●</span> NOW LIVE
            </div>
            {live ? (
              <div className="pixel-card" style={{ padding: "1.25rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#ffd700", marginBottom: "0.25rem" }}>{live.singer.name}</div>
                <div style={{ fontSize: "0.6rem", color: "#00ff88", marginBottom: "0.75rem" }}>♪ {live.song}</div>
                <div className="flex flex-wrap gap-2" style={{ marginBottom: "1rem" }}>
                  {live.band.map(m => (
                    <span key={m.id} className="pixel-panel" style={{ fontSize: "0.45rem", padding: "0.3rem 0.5rem" }}>
                      {INSTRUMENT_ICONS[m.instrument]} {m.name}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => markDone(live.id)}
                  className="pixel-btn"
                  style={{ background: "#ff4444", color: "#fff", border: "4px solid #000", fontSize: "0.55rem", padding: "0.6rem 1rem" }}
                >
                  ✓ MARK DONE
                </button>
              </div>
            ) : (
              <div className="pixel-card" style={{ padding: "1rem", opacity: 0.5 }}>
                <div style={{ fontSize: "0.5rem", color: "#666" }}>NO ONE ON STAGE</div>
              </div>
            )}
          </div>

          {/* Queue */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.5rem" }}>QUEUE ({queued.length})</div>
            <div className="flex flex-col gap-2">
              {queued.map((perf, qi) => {
                const sv = (perf as Performance & { songVotes?: number[] }).songVotes ?? [0, 0, 0]
                const totalVotes = sv.reduce((a: number, b: number) => a + b, 0)
                const topSong = sv.indexOf(Math.max(...sv))
                return (
                  <div key={perf.id} className="pixel-card" style={{ padding: "0.9rem", borderColor: qi === 0 ? "#ffaa00" : "#333" }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div style={{ fontSize: "0.6rem", color: qi === 0 ? "#ffaa00" : "#aaa", marginBottom: "0.25rem" }}>
                          #{qi + 1} {perf.singer.name}
                        </div>
                        <div style={{ fontSize: "0.45rem", color: "#666", lineHeight: 1.7 }}>
                          {perf.singer.songs.map((s, si) => (
                            <span key={si} style={{ color: si === topSong && totalVotes > 0 ? "#00ff88" : "#666", marginRight: "0.5rem" }}>
                              {si === topSong && totalVotes > 0 ? "▶" : "·"} {s} ({sv[si] ?? 0}v)
                            </span>
                          ))}
                        </div>
                      </div>
                      {qi === 0 && !live && (
                        <button
                          onClick={() => {
                            const topSong = sv.indexOf(Math.max(...sv))
                            callToStageWithSong(perf.id, topSong >= 0 ? topSong : 0)
                          }}
                          className="pixel-btn"
                          style={{ background: "#ffaa00", color: "#000", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
                        >
                          CALL UP ▶
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
              {queued.length === 0 && (
                <div style={{ fontSize: "0.45rem", color: "#444" }}>QUEUE IS EMPTY</div>
              )}
            </div>
          </div>

          {/* Add singer to queue */}
          {singersNotQueued.length > 0 && (
            <div>
              <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.5rem" }}>
                ADD TO QUEUE ({singersNotQueued.length} NOT QUEUED)
              </div>
              <div className="flex flex-col gap-2">
                {singersNotQueued.map(s => (
                  <div key={s.id} className="pixel-card" style={{ padding: "0.9rem", borderColor: "#2a2a5e" }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div style={{ fontSize: "0.6rem", color: "#aaa", marginBottom: "0.2rem" }}>{s.name}</div>
                        <div style={{ fontSize: "0.4rem", color: "#555" }}>
                          {s.songs.map((sg, si) => `${si + 1}. ${sg}`).join(" · ")}
                        </div>
                      </div>
                      <button
                        onClick={() => callToStage(s)}
                        className="pixel-btn"
                        style={{ background: "#00ff88", color: "#000", border: "4px solid #000", fontSize: "0.5rem", padding: "0.5rem 0.75rem" }}
                      >
                        QUEUE ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ROSTER TAB */}
      {tab === "roster" && (
        <div>
          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem" }}>
            MUSICIANS — TOGGLE AVAILABILITY
          </div>
          {data.musicians.length === 0 ? (
            <div style={{ fontSize: "0.45rem", color: "#444" }}>NO MUSICIANS YET</div>
          ) : (
            <div className="flex flex-col gap-2">
              {data.musicians.map(m => (
                <div key={m.id} className="pixel-card" style={{ padding: "0.9rem", borderColor: m.available ? "#ffd700" : "#333" }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <div style={{ fontSize: "0.6rem", color: m.available ? "#ffd700" : "#666" }}>
                        {INSTRUMENT_ICONS[m.instrument]} {m.name}
                      </div>
                      <div style={{ fontSize: "0.4rem", color: "#555" }}>
                        {INSTRUMENT_LABELS[m.instrument]}{m.canSing ? " · CAN SING" : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAvailable(m)}
                      className="pixel-btn"
                      style={{
                        background: m.available ? "#ffd700" : "#333",
                        color: m.available ? "#000" : "#888",
                        border: "4px solid #000",
                        fontSize: "0.45rem",
                        padding: "0.4rem 0.6rem",
                      }}
                    >
                      {m.available ? "AVAILABLE" : "UNAVAILABLE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SINGERS TAB */}
      {tab === "singers" && (
        <div>
          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem" }}>
            ALL SINGERS ({data.singers.length})
          </div>
          <div className="flex flex-col gap-2">
            {data.singers.map(s => {
              const perf = data.performances.find(p => p.singer.id === s.id)
              return (
                <div key={s.id} className="pixel-card" style={{ padding: "0.9rem", borderColor: perf?.status === "done" ? "#333" : perf?.status === "live" ? "#ff4444" : "#2a2a5e" }}>
                  <div style={{ fontSize: "0.6rem", color: "#aaa", marginBottom: "0.25rem" }}>{s.name}</div>
                  <div style={{ fontSize: "0.4rem", color: "#555", marginBottom: "0.25rem" }}>
                    {s.songs.map((sg, si) => `${si + 1}. ${sg}`).join(" · ")}
                  </div>
                  <div style={{ fontSize: "0.4rem", color: perf?.status === "done" ? "#555" : perf?.status === "live" ? "#ff4444" : perf?.status === "queued" ? "#ffaa00" : "#444" }}>
                    STATUS: {perf?.status?.toUpperCase() ?? "NOT QUEUED"}
                  </div>
                </div>
              )
            })}
            {data.singers.length === 0 && (
              <div style={{ fontSize: "0.45rem", color: "#444" }}>NO SINGERS YET</div>
            )}
          </div>
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

      {loading && (
        <div style={{ position: "fixed", bottom: "1rem", right: "1rem", fontSize: "0.4rem", color: "#444" }}>
          SYNCING...
        </div>
      )}
    </div>
  )
}


"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import type { Performance, Singer } from "@/lib/types"
import { INSTRUMENT_ICONS, INSTRUMENT_LABELS } from "@/lib/types"

interface StageData {
  live: Performance | null
  queued: Performance[]
  singers: Singer[]
}

function getVoterId() {
  if (typeof window === "undefined") return ""
  let id = localStorage.getItem("voter_id")
  if (!id) {
    id = `voter_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem("voter_id", id)
  }
  return id
}

export default function StagePage() {
  const [data, setData] = useState<StageData>({ live: null, queued: [], singers: [] })
  const [myVotes, setMyVotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [votingFor, setVotingFor] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/performances?include=singers")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load stored votes
    const stored = localStorage.getItem("my_votes")
    if (stored) setMyVotes(JSON.parse(stored))
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [fetchData])

  async function vote(performanceId: string, songIndex: number) {
    if (myVotes[performanceId] !== undefined) return
    setVotingFor(performanceId)
    const voterId = getVoterId()
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ performanceId, songIndex, voterId }),
      })
      if (res.ok) {
        const updated = { ...myVotes, [performanceId]: String(songIndex) }
        setMyVotes(updated)
        localStorage.setItem("my_votes", JSON.stringify(updated))
        await fetchData()
      }
    } finally {
      setVotingFor(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="blink" style={{ fontSize: "0.7rem", color: "#ffd700" }}>LOADING...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8" style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none" }}>← HOME</Link>
        <h1 style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "2px 2px 0 #b8860b" }}>
          🎵 LIVE STAGE
        </h1>
        <div style={{ fontSize: "0.45rem", color: "#444" }}>AUTO-REFRESH 10s</div>
      </div>

      {/* Currently Live */}
      {data.live ? (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.5rem", color: "#ff4444", marginBottom: "0.75rem", letterSpacing: "0.2em" }}>
            <span className="blink">●</span> NOW PERFORMING
          </div>
          <div className="pixel-card march-border" style={{ padding: "1.5rem" }}>
            <div style={{ fontSize: "1.2rem", color: "#ffd700", marginBottom: "0.25rem" }}>
              {data.live.singer ? data.live.singer.name.toUpperCase() : "🎵 INSTRUMENTAL"}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#00ff88", marginBottom: "1.25rem" }}>
              ♪ {data.live.title}
            </div>
            <div style={{ fontSize: "0.45rem", color: "#888", marginBottom: "0.5rem" }}>THE BAND:</div>
            <div className="flex flex-wrap gap-2">
              {data.live.band.map(m => (
                <div key={m.id} className="pixel-panel" style={{ padding: "0.4rem 0.6rem", fontSize: "0.45rem" }}>
                  {m.instruments.map(i => INSTRUMENT_ICONS[i]).join("")} {m.name.toUpperCase()}
                  <span style={{ color: "#666", marginLeft: "0.25rem" }}>({m.instruments.map(i => INSTRUMENT_LABELS[i]).join(", ")})</span>
                </div>
              ))}
              {data.live.band.length === 0 && (
                <span style={{ fontSize: "0.45rem", color: "#666" }}>BAND NOT ASSIGNED YET</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="pixel-card text-center" style={{ padding: "2rem", marginBottom: "2rem", opacity: 0.6 }}>
          <div style={{ fontSize: "0.6rem", color: "#888" }}>NO ONE ON STAGE YET</div>
          <div style={{ fontSize: "0.45rem", color: "#666", marginTop: "0.5rem" }}>AWAITING HOST CUE...</div>
        </div>
      )}

      {/* Queue + Voting */}
      {data.queued.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem", letterSpacing: "0.2em" }}>
            UPCOMING PERFORMERS — VOTE FOR YOUR SONG!
          </div>

          <div className="flex flex-col gap-4">
            {data.queued.map((perf, qi) => {
              const voted = myVotes[perf.id]
              const isVoting = votingFor === perf.id
              const totalVotes = (perf as Performance & { songVotes?: number[] }).songVotes
                ? (perf as Performance & { songVotes?: number[] }).songVotes!.reduce((a, b) => a + b, 0)
                : 0

              return (
                <div key={perf.id} className="pixel-card" style={{ padding: "1.25rem", borderColor: qi === 0 ? "#ffaa00" : "#4a4a8a" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontSize: "0.65rem", color: qi === 0 ? "#ffaa00" : "#aaa" }}>
                        {qi === 0 ? "▶ NEXT UP:" : `#${qi + 2}`} {perf.singer ? perf.singer.name.toUpperCase() : "🎵 INSTRUMENTAL"}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.45rem", color: "#666" }}>
                      {totalVotes} VOTE{totalVotes !== 1 ? "S" : ""}
                    </div>
                  </div>

                  {perf.singer && <div style={{ fontSize: "0.45rem", color: "#888", marginBottom: "0.5rem" }}>
                    {voted !== undefined ? "YOU VOTED — RESULTS:" : "VOTE FOR A SONG:"}
                  </div>}

                  <div className="flex flex-col gap-2">
                    {(perf.singer?.songs ?? [perf.title]).map((song, si) => {
                      const songVotes = ((perf as Performance & { songVotes?: number[] }).songVotes ?? [0, 0, 0])[si] ?? 0
                      const pct = totalVotes > 0 ? Math.round((songVotes / totalVotes) * 100) : 0
                      const isMyVote = voted === String(si)

                      return (
                        <button
                          key={si}
                          onClick={() => voted === undefined && !isVoting && vote(perf.id, si)}
                          disabled={voted !== undefined || isVoting}
                          className="pixel-btn"
                          style={{
                            background: isMyVote ? "#ffd700" : voted !== undefined ? "#1a1a4e" : "#0d0d3a",
                            color: isMyVote ? "#000" : voted !== undefined ? "#888" : "#ffd700",
                            border: `4px solid ${isMyVote ? "#000" : voted !== undefined ? "#333" : "#ffd700"}`,
                            boxShadow: `4px 4px 0 0 ${isMyVote ? "#000" : "#222"}`,
                            padding: "0.6rem 0.75rem",
                            fontSize: "0.5rem",
                            textAlign: "left",
                            width: "100%",
                            cursor: voted !== undefined ? "default" : "pointer",
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span>
                              {isMyVote ? "✓ " : si === 0 ? "♩ " : si === 1 ? "♪ " : "♫ "}
                              {song}
                            </span>
                            {voted !== undefined && (
                              <span style={{ color: isMyVote ? "#000" : "#666", minWidth: "3em", textAlign: "right" }}>
                                {pct}%
                              </span>
                            )}
                          </div>
                          {voted !== undefined && (
                            <div style={{ marginTop: "0.3rem", height: 6, background: "#111", border: "1px solid #333", overflow: "hidden" }}>
                              <div style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: isMyVote ? "#ffd700" : "#444",
                                transition: "width 0.5s ease",
                              }} />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {isVoting && (
                    <div style={{ fontSize: "0.45rem", color: "#888", marginTop: "0.5rem", textAlign: "center" }}>
                      RECORDING VOTE...
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Singer list */}
      {data.singers.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem", letterSpacing: "0.2em" }}>
            REGISTERED SINGERS
          </div>
          <div className="pixel-card" style={{ padding: "1rem" }}>
            <div className="flex flex-col gap-2">
              {data.singers.map(s => {
                const inQueue = data.queued.some(p => p.singer?.id === s.id)
                const isLive = data.live?.singer?.id === s.id
                return (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.5rem", color: isLive ? "#ffd700" : inQueue ? "#ffaa00" : "#aaa" }}>
                      {isLive ? "🎤 " : inQueue ? "⏳ " : "○ "}{s.name.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "0.4rem", color: isLive ? "#ff4444" : inQueue ? "#ffaa00" : "#555" }}>
                      {isLive ? "ON STAGE" : inQueue ? "IN QUEUE" : "WAITING"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Registered musicians */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontSize: "0.5rem", color: "#888", marginBottom: "0.75rem", letterSpacing: "0.2em" }}>
          BAND ROSTER
        </div>
        <MusicianRoster />
      </div>

      {/* Sign up CTA */}
      <div className="pixel-card text-center" style={{ padding: "1.5rem", borderColor: "#444" }}>
        <div style={{ fontSize: "0.55rem", color: "#888", marginBottom: "1rem" }}>
          WANT TO PERFORM?
        </div>
        <Link href="/join">
          <button className="pixel-btn" style={{ background: "#ffd700", color: "#000", fontSize: "0.6rem", padding: "0.75rem 1.5rem" }}>
            SIGN UP ▶
          </button>
        </Link>
      </div>

      <div className="text-center" style={{ marginTop: "1.5rem" }}>
        <Link href="/cocktails" style={{ fontSize: "0.45rem", color: "#ff88cc", textDecoration: "none" }}>
          ▶ VIEW COCKTAIL MENU
        </Link>
      </div>
    </div>
  )
}

function MusicianRoster() {
  const [musicians, setMusicians] = useState<import("@/lib/types").Musician[]>([])

  useEffect(() => {
    fetch("/api/musicians").then(r => r.json()).then(setMusicians).catch(() => {})
  }, [])

  if (musicians.length === 0) {
    return <div style={{ fontSize: "0.45rem", color: "#444" }}>NO MUSICIANS REGISTERED YET</div>
  }

  const byInstrument = musicians.reduce((acc, m) => {
    for (const inst of m.instruments) {
      if (!acc[inst]) acc[inst] = []
      if (!acc[inst].find(x => x.id === m.id)) acc[inst].push(m)
    }
    return acc
  }, {} as Record<string, typeof musicians>)

  return (
    <div className="pixel-card" style={{ padding: "1rem" }}>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {Object.entries(byInstrument).map(([inst, ms]) => (
          <div key={inst}>
            <div style={{ fontSize: "0.4rem", color: "#666", marginBottom: "0.25rem" }}>
              {INSTRUMENT_ICONS[inst as import("@/lib/types").Instrument]} {INSTRUMENT_LABELS[inst as import("@/lib/types").Instrument].toUpperCase()}
            </div>
            {ms.map(m => (
              <div key={m.id} style={{
                fontSize: "0.45rem",
                color: m.available ? "#00ff88" : "#666",
                marginBottom: "0.2rem",
              }}>
                {m.available ? "●" : "○"} {m.name}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

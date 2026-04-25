"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

interface SingerWithVotes {
  id: string
  name: string
  songs: [string, string, string]
  votes: number[]
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

export default function VotePage() {
  const [singers, setSingers] = useState<SingerWithVotes[]>([])
  const [myVotes, setMyVotes] = useState<Record<string, number>>({})
  const [voting, setVoting] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/singervote")
    if (res.ok) setSingers(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem("my_singer_votes")
    if (stored) setMyVotes(JSON.parse(stored))
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [fetchData])

  async function vote(singerId: string, songIndex: number) {
    if (myVotes[singerId] !== undefined || voting) return
    setVoting(`${singerId}:${songIndex}`)
    const res = await fetch("/api/singervote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ singerId, songIndex, voterId: getVoterId() }),
    })
    if (res.ok) {
      const updated = { ...myVotes, [singerId]: songIndex }
      setMyVotes(updated)
      localStorage.setItem("my_singer_votes", JSON.stringify(updated))
      await fetchData()
    }
    setVoting(null)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="blink" style={{ fontSize: "0.7rem", color: "#ffd700" }}>LOADING...</div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-8" style={{ maxWidth: 600, margin: "0 auto" }}>

      <div className="flex items-center justify-between" style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none" }}>← HOME</Link>
        <h1 style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "2px 2px 0 #b8860b" }}>
          🎵 SONG VOTES
        </h1>
        <div style={{ fontSize: "0.4rem", color: "#444" }}>AUTO 15s</div>
      </div>

      <div style={{ fontSize: "0.45rem", color: "#888", marginBottom: "1.5rem", textAlign: "center" }}>
        PICK YOUR FAVOURITE SONG FOR EACH SINGER
      </div>

      {singers.length === 0 && (
        <div className="pixel-card text-center" style={{ padding: "2rem" }}>
          <div style={{ fontSize: "0.55rem", color: "#555" }}>NO SINGERS REGISTERED YET</div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {singers.map(singer => {
          const totalVotes = singer.votes.reduce((a, b) => a + b, 0)
          const myVote = myVotes[singer.id]
          const hasVoted = myVote !== undefined

          return (
            <div key={singer.id} className="pixel-card" style={{ padding: "1.25rem" }}>
              <div style={{ fontSize: "0.65rem", color: "#ffd700", marginBottom: "0.75rem" }}>
                {singer.name.toUpperCase()}
                <span style={{ fontSize: "0.4rem", color: "#555", marginLeft: "0.6rem" }}>
                  {totalVotes} VOTE{totalVotes !== 1 ? "S" : ""}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {singer.songs.map((song, si) => {
                  const count = singer.votes[si] ?? 0
                  const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
                  const isMyVote = hasVoted && myVote === si
                  const isTop = totalVotes > 0 && count === Math.max(...singer.votes)

                  return (
                    <button
                      key={si}
                      onClick={() => !hasVoted && vote(singer.id, si)}
                      disabled={hasVoted || !!voting}
                      className="pixel-btn"
                      style={{
                        background: isMyVote ? "#ffd700" : hasVoted ? "#1a1a4e" : "#0d0d3a",
                        color: isMyVote ? "#000" : hasVoted ? "#aaa" : "#ffd700",
                        border: `4px solid ${isMyVote ? "#000" : isTop && totalVotes > 0 ? "#ffd700" : hasVoted ? "#333" : "#ffd700"}`,
                        boxShadow: `4px 4px 0 0 ${isMyVote ? "#000" : "#222"}`,
                        padding: "0.6rem 0.75rem",
                        fontSize: "0.5rem",
                        textAlign: "left",
                        width: "100%",
                        cursor: hasVoted ? "default" : "pointer",
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {isMyVote ? "✓ " : si === 0 ? "♩ " : si === 1 ? "♪ " : "♫ "}
                          {song}
                        </span>
                        <span style={{ fontSize: "0.45rem", color: isMyVote ? "#000" : "#666", minWidth: "4em", textAlign: "right" }}>
                          {count}v {hasVoted ? `· ${pct}%` : ""}
                        </span>
                      </div>
                      {hasVoted && (
                        <div style={{ marginTop: "0.3rem", height: 5, background: "#111", border: "1px solid #333", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: isMyVote ? "#ffd700" : isTop ? "#00ff88" : "#444",
                            transition: "width 0.5s ease",
                          }} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {!hasVoted && (
                <div style={{ fontSize: "0.38rem", color: "#555", marginTop: "0.5rem" }}>
                  TAP A SONG TO VOTE · ONE VOTE PER SINGER
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-center" style={{ marginTop: "2rem" }}>
        <Link href="/stage" style={{ fontSize: "0.45rem", color: "#00ff88", textDecoration: "none" }}>
          ▶ VIEW LIVE STAGE
        </Link>
      </div>
    </div>
  )
}

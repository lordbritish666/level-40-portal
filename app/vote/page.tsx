"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

interface SingerWithVotes {
  id: string
  name: string
  songs: string[]
  votes: number[]
}

interface SongEntry {
  singerId: string
  singerName: string
  song: string
  songIndex: number
  votes: number
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

const MEDALS = ["🥇", "🥈", "🥉"]

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
    const interval = setInterval(fetchData, 10000)
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

  // Flatten all songs into a ranked list
  const allSongs: SongEntry[] = singers.flatMap(s =>
    s.songs.filter(Boolean).map((song, i) => ({
      singerId: s.id,
      singerName: s.name,
      song,
      songIndex: i,
      votes: s.votes[i] ?? 0,
    }))
  ).sort((a, b) => b.votes - a.votes)

  const topVotes = allSongs[0]?.votes ?? 0

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="blink" style={{ fontSize: "0.7rem", color: "#ffd700" }}>LOADING...</div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-8" style={{ maxWidth: 600, margin: "0 auto" }}>

      <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem" }}>
        <Link href="/" style={{ fontSize: "0.45rem", color: "#888", textDecoration: "none" }}>← HOME</Link>
        <h1 style={{ fontSize: "clamp(0.7rem, 3vw, 1rem)", color: "#ffd700", textShadow: "2px 2px 0 #b8860b" }}>
          🏆 SONG LEADERBOARD
        </h1>
        <div style={{ fontSize: "0.4rem", color: "#444" }}>AUTO 10s</div>
      </div>

      <div style={{ fontSize: "0.4rem", color: "#555", textAlign: "center", marginBottom: "1.5rem" }}>
        TAP A SONG TO VOTE · ONE VOTE PER SINGER
      </div>

      {allSongs.length === 0 && (
        <div className="pixel-card text-center" style={{ padding: "2rem" }}>
          <div style={{ fontSize: "0.55rem", color: "#555" }}>NO SINGERS REGISTERED YET</div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {allSongs.map((entry, rank) => {
          const hasVotedSinger = myVotes[entry.singerId] !== undefined
          const isMyVote = myVotes[entry.singerId] === entry.songIndex
          const isVoting = voting === `${entry.singerId}:${entry.songIndex}`
          const pct = topVotes > 0 ? Math.round((entry.votes / topVotes) * 100) : 0
          const medal = MEDALS[rank] ?? null
          const canVote = !hasVotedSinger && !voting

          return (
            <button
              key={`${entry.singerId}:${entry.songIndex}`}
              onClick={() => canVote && vote(entry.singerId, entry.songIndex)}
              disabled={!canVote}
              className="pixel-btn"
              style={{
                background: isMyVote ? "#ffd700" : hasVotedSinger ? "#111122" : "#0d0d3a",
                color: isMyVote ? "#000" : hasVotedSinger ? "#666" : "#ffd700",
                border: `4px solid ${isMyVote ? "#000" : rank === 0 && entry.votes > 0 ? "#ffd700" : hasVotedSinger ? "#222" : "#334"}`,
                boxShadow: `4px 4px 0 0 ${isMyVote ? "#000" : "#111"}`,
                padding: "0.75rem 0.9rem",
                fontSize: "0.5rem",
                textAlign: "left",
                width: "100%",
                cursor: canVote ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <span>
                  <span style={{ fontSize: "0.55rem", marginRight: "0.4rem" }}>
                    {medal ?? `#${rank + 1}`}
                  </span>
                  {isMyVote ? "✓ " : ""}{entry.song}
                </span>
                <span style={{ fontSize: "0.45rem", color: isMyVote ? "#000" : "#888", flexShrink: 0, marginLeft: "0.5rem" }}>
                  {isVoting ? "..." : `${entry.votes}v`}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, height: 5, background: "#111", border: "1px solid #222", overflow: "hidden", marginRight: "0.5rem" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: isMyVote ? "#000" : rank === 0 && entry.votes > 0 ? "#ffd700" : rank === 1 ? "#aaa" : rank === 2 ? "#cd7f32" : "#335",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <span style={{ fontSize: "0.38rem", color: isMyVote ? "#333" : "#555", flexShrink: 0 }}>
                  {entry.singerName.toUpperCase()}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {allSongs.length > 0 && (
        <div style={{ fontSize: "0.38rem", color: "#333", textAlign: "center", marginTop: "1.5rem" }}>
          {Object.keys(myVotes).length} OF {singers.length} SINGERS VOTED
        </div>
      )}
    </div>
  )
}

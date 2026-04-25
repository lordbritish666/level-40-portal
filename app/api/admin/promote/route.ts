import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { getPerformances, savePerformances, getMusicians, saveMusicians } from "@/lib/kv"

// Promotes a queued performance to live (also moves any existing live → done first)
export async function POST(req: NextRequest) {
  const { performanceId, songIndex } = await req.json()

  if (!performanceId) return new NextResponse("performanceId required", { status: 400 })

  const [performances, musicians] = await Promise.all([getPerformances(), getMusicians()])

  // Move current live to done
  const liveIdx = performances.findIndex(p => p.status === "live")
  if (liveIdx !== -1) {
    performances[liveIdx].status = "done"
    // Free up the band members
    const donePerf = performances[liveIdx]
    for (const bandMember of donePerf.band) {
      const m = musicians.find(m => m.id === bandMember.id)
      if (m) m.available = true
    }
  }

  const perfIdx = performances.findIndex(p => p.id === performanceId)
  if (perfIdx === -1) return new NextResponse("Performance not found", { status: 404 })

  const perf = performances[perfIdx]

  // Determine song: use top-voted or specified index
  const idx = typeof songIndex === "number" ? Math.max(0, Math.min(2, songIndex)) : 0
  const songVotes = await Promise.all(
    perf.singer.songs.map((_, i) =>
      kv.get<number>(`songvotes:${performanceId}:${i}`).then(v => v ?? 0)
    )
  )
  const topIdx = songVotes.indexOf(Math.max(...songVotes))
  const finalSongIdx = songVotes[topIdx] > 0 ? topIdx : idx
  perf.song = perf.singer.songs[finalSongIdx]
  perf.status = "live"

  // Mark band members as unavailable
  for (const bandMember of perf.band) {
    const m = musicians.find(m => m.id === bandMember.id)
    if (m) m.available = false
  }

  await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  return NextResponse.json(perf)
}

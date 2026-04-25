import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { getPerformances, savePerformances, getMusicians, saveMusicians } from "@/lib/kv"

export async function POST(req: NextRequest) {
  const { performanceId, songIndex } = await req.json()

  if (!performanceId) return new NextResponse("performanceId required", { status: 400 })

  const [performances, musicians] = await Promise.all([getPerformances(), getMusicians()])

  // Move current live to done, free up band
  const liveIdx = performances.findIndex(p => p.status === "live")
  if (liveIdx !== -1) {
    performances[liveIdx].status = "done"
    for (const bandMember of performances[liveIdx].band) {
      const m = musicians.find(m => m.id === bandMember.id)
      if (m) m.available = true
    }
  }

  const perfIdx = performances.findIndex(p => p.id === performanceId)
  if (perfIdx === -1) return new NextResponse("Performance not found", { status: 404 })

  const perf = performances[perfIdx]

  // Determine title: for singer performances, pick top-voted song
  if (perf.singer) {
    const idx = typeof songIndex === "number" ? Math.max(0, Math.min(2, songIndex)) : 0
    const songVotes = await Promise.all(
      perf.singer.songs.map((_, i) =>
        kv.get<number>(`songvotes:${performanceId}:${i}`).then(v => v ?? 0)
      )
    )
    const topIdx = songVotes.indexOf(Math.max(...songVotes))
    const finalIdx = songVotes[topIdx] > 0 ? topIdx : idx
    perf.title = perf.singer.songs[finalIdx]
  }
  // For instrumentals, title is already set

  perf.status = "live"

  for (const bandMember of perf.band) {
    const m = musicians.find(m => m.id === bandMember.id)
    if (m) m.available = false
  }

  await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  return NextResponse.json(perf)
}

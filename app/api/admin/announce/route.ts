import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getPerformances, savePerformances, getMusicians, saveMusicians, getSingers } from "@/lib/kv"
import { kv } from "@vercel/kv"
import type { Performance, Musician } from "@/lib/types"

function assembleBand(musicians: Musician[]) {
  const available = musicians.filter(m => m.available)
  const byInstrument: Record<string, Musician[]> = {}
  for (const m of available) {
    for (const inst of m.instruments) {
      if (!byInstrument[inst]) byInstrument[inst] = []
      byInstrument[inst].push(m)
    }
  }
  const band: Musician[] = []
  const usedIds = new Set<string>()
  for (const group of Object.values(byInstrument)) {
    const pick = [...group].sort(() => Math.random() - 0.5).find(m => !usedIds.has(m.id))
    if (pick) { band.push(pick); usedIds.add(pick.id) }
  }
  return band
}

export async function POST(req: NextRequest) {
  const { singerId, title } = await req.json()
  if (!singerId && !title?.trim()) return new NextResponse("singerId or title required", { status: 400 })

  const [performances, musicians, singers] = await Promise.all([
    getPerformances(), getMusicians(), getSingers(),
  ])

  // Free up band from any current live
  const liveIdx = performances.findIndex(p => p.status === "live")
  if (liveIdx !== -1) {
    performances[liveIdx].status = "done"
    for (const m of performances[liveIdx].band) {
      const musician = musicians.find(x => x.id === m.id)
      if (musician) musician.available = true
    }
  }

  const band = assembleBand(musicians)

  let perf: Performance
  if (singerId) {
    const singer = singers.find(s => s.id === singerId)
    if (!singer) return new NextResponse("Singer not found", { status: 404 })

    // Pick top-voted song
    const votes = await Promise.all(
      singer.songs.map((_, i) => kv.get<number>(`sv:${singerId}:${i}`).then(v => v ?? 0))
    )
    const topIdx = votes.indexOf(Math.max(...votes))
    const songTitle = singer.songs[votes[topIdx] > 0 ? topIdx : 0]

    perf = { id: uuid(), singer, title: songTitle, band, status: "live", votes: 0, createdAt: Date.now() }
  } else {
    perf = { id: uuid(), title: title.trim(), band, status: "live", votes: 0, createdAt: Date.now() }
  }

  for (const m of band) {
    const musician = musicians.find(x => x.id === m.id)
    if (musician) musician.available = false
  }

  performances.push(perf)
  await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  return NextResponse.json(perf)
}

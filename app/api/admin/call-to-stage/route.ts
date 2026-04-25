import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getSingers, getMusicians, getPerformances, addPerformance } from "@/lib/kv"
import type { Musician, Performance } from "@/lib/types"

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
    const shuffled = [...group].sort(() => Math.random() - 0.5)
    const pick = shuffled.find(m => !usedIds.has(m.id))
    if (pick) { band.push(pick); usedIds.add(pick.id) }
  }
  return band
}

export async function POST(req: NextRequest) {
  const { singerId, title } = await req.json()

  const [singers, musicians, performances] = await Promise.all([
    getSingers(), getMusicians(), getPerformances(),
  ])

  // Instrumental — no singer required
  if (!singerId) {
    if (!title?.trim()) return new NextResponse("Title required for instrumental", { status: 400 })
    const band = assembleBand(musicians)
    const performance: Performance = {
      id: uuid(), title: title.trim(), band,
      status: "queued", votes: 0, createdAt: Date.now(),
    }
    await addPerformance(performance)
    return NextResponse.json(performance, { status: 201 })
  }

  const singer = singers.find(s => s.id === singerId)
  if (!singer) return new NextResponse("Singer not found", { status: 404 })

  const existing = performances.find(p => p.singer?.id === singerId && p.status !== "done")
  if (existing) return new NextResponse("Singer already in queue", { status: 409 })

  const band = assembleBand(musicians)
  const performance: Performance = {
    id: uuid(), singer, title: singer.songs[0],
    band, status: "queued", votes: 0, createdAt: Date.now(),
  }
  await addPerformance(performance)
  return NextResponse.json(performance, { status: 201 })
}

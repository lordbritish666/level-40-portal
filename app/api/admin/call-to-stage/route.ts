import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getSingers, getMusicians, getPerformances, addPerformance } from "@/lib/kv"
import type { Performance } from "@/lib/types"

// Randomly assigns a band from available musicians, trying to cover all instrument types
function assembleBand(musicians: import("@/lib/types").Musician[]) {
  const available = musicians.filter(m => m.available)

  // Group by instrument
  const byInstrument = available.reduce((acc, m) => {
    if (!acc[m.instrument]) acc[m.instrument] = []
    acc[m.instrument].push(m)
    return acc
  }, {} as Record<string, typeof available>)

  const band: typeof available = []

  // Pick one from each instrument group (shuffle to randomize)
  for (const group of Object.values(byInstrument)) {
    const shuffled = [...group].sort(() => Math.random() - 0.5)
    band.push(shuffled[0])
  }

  return band
}

export async function POST(req: NextRequest) {
  const { singerId } = await req.json()

  if (!singerId) return new NextResponse("singerId required", { status: 400 })

  const [singers, musicians, performances] = await Promise.all([
    getSingers(),
    getMusicians(),
    getPerformances(),
  ])

  const singer = singers.find(s => s.id === singerId)
  if (!singer) return new NextResponse("Singer not found", { status: 404 })

  // Check not already queued or live
  const existing = performances.find(p => p.singer.id === singerId && p.status !== "done")
  if (existing) return new NextResponse("Singer already in queue", { status: 409 })

  const band = assembleBand(musicians)

  const performance: Performance = {
    id: uuid(),
    singer,
    song: singer.songs[0], // will be updated when promoted to live
    band,
    status: "queued",
    votes: 0,
    createdAt: Date.now(),
  }

  await addPerformance(performance)
  return NextResponse.json(performance, { status: 201 })
}

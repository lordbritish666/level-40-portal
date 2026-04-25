import { NextRequest, NextResponse } from "next/server"
import { getPerformances, savePerformances, getMusicians, saveMusicians } from "@/lib/kv"

export async function POST(req: NextRequest) {
  const { performanceId } = await req.json()
  if (!performanceId) return new NextResponse("performanceId required", { status: 400 })

  const [performances, musicians] = await Promise.all([getPerformances(), getMusicians()])

  const perfIdx = performances.findIndex(p => p.id === performanceId)
  if (perfIdx === -1) return new NextResponse("Not found", { status: 404 })

  const perf = performances[perfIdx]
  perf.status = "done"

  // Free up band members
  for (const bandMember of perf.band) {
    const m = musicians.find(m => m.id === bandMember.id)
    if (m) m.available = true
  }

  await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  return NextResponse.json({ ok: true })
}

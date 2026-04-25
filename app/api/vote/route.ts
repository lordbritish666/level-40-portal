import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { getPerformances } from "@/lib/kv"

export async function POST(req: NextRequest) {
  const { performanceId, songIndex, voterId } = await req.json()

  if (!performanceId || songIndex === undefined || !voterId) {
    return new NextResponse("Missing fields", { status: 400 })
  }

  const performances = await getPerformances()
  const perf = performances.find(p => p.id === performanceId)

  if (!perf) return new NextResponse("Performance not found", { status: 404 })
  if (perf.status !== "queued") return new NextResponse("Not in queue", { status: 400 })
  if (songIndex < 0 || songIndex > 2) return new NextResponse("Invalid song index", { status: 400 })

  // Check for duplicate vote (per-voter, per-performance)
  const voterKey = `voter:${performanceId}:${voterId}`
  const alreadyVoted = await kv.get(voterKey)
  if (alreadyVoted !== null) {
    return new NextResponse("Already voted", { status: 409 })
  }

  // Record vote
  await Promise.all([
    kv.incr(`songvotes:${performanceId}:${songIndex}`),
    kv.set(voterKey, songIndex, { ex: 86400 }),
  ])

  return NextResponse.json({ ok: true })
}

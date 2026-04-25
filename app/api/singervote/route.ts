import { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { getSingers } from "@/lib/kv"

export async function GET() {
  const singers = await getSingers()
  const result = await Promise.all(
    singers.map(async s => {
      const votes = await Promise.all(
        s.songs.filter(Boolean).map((_, i) => kv.get<number>(`sv:${s.id}:${i}`).then(v => v ?? 0))
      )
      return { ...s, votes }
    })
  )
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const { singerId, songIndex, voterId } = await req.json()
  if (!singerId || songIndex === undefined || !voterId) {
    return new NextResponse("Missing fields", { status: 400 })
  }
  const alreadyVoted = await kv.sismember(`sv_voters:${singerId}`, voterId)
  if (alreadyVoted) return new NextResponse("Already voted", { status: 409 })
  await Promise.all([
    kv.incr(`sv:${singerId}:${songIndex}`),
    kv.sadd(`sv_voters:${singerId}`, voterId),
  ])
  return NextResponse.json({ ok: true })
}

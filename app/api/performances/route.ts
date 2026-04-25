import { NextRequest, NextResponse } from "next/server"
import { getPerformances, getSingers } from "@/lib/kv"
import { kv } from "@vercel/kv"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const includeSingers = searchParams.get("include") === "singers"

  const performances = await getPerformances()
  const live = performances.find(p => p.status === "live" || p.status === "wrapping") ?? null
  const queued = performances
    .filter(p => p.status === "queued")
    .sort((a, b) => a.createdAt - b.createdAt)

  // Attach vote counts per song for queued performances
  const queuedWithVotes = await Promise.all(
    queued.map(async p => {
      const songCount = p.singer ? 3 : 1
      const votes = await Promise.all(
        Array.from({ length: songCount }, (_, i) =>
          kv.get<number>(`songvotes:${p.id}:${i}`).then(v => v ?? 0)
        )
      )
      return { ...p, songVotes: votes }
    })
  )

  if (searchParams.get("include") === "all") {
    return NextResponse.json(performances)
  }

  const response: Record<string, unknown> = { live, queued: queuedWithVotes }

  if (includeSingers) {
    response.singers = await getSingers()
  }

  return NextResponse.json(response)
}

import { NextResponse } from "next/server"
import { getPerformances, savePerformances, getMusicians, saveMusicians } from "@/lib/kv"

export async function POST() {
  const [performances, musicians] = await Promise.all([getPerformances(), getMusicians()])
  const liveIdx = performances.findIndex(p => p.status === "live")
  if (liveIdx !== -1) {
    performances[liveIdx].status = "wrapping"
    for (const m of performances[liveIdx].band) {
      const musician = musicians.find(x => x.id === m.id)
      if (musician) musician.available = true
    }
    await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  }
  return NextResponse.json({ ok: true })
}

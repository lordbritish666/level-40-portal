import { NextResponse } from "next/server"
import { getPerformances, savePerformances, getMusicians, saveMusicians } from "@/lib/kv"

export async function POST() {
  const [performances, musicians] = await Promise.all([getPerformances(), getMusicians()])
  let changed = false
  for (const p of performances) {
    if (p.status === "live" || p.status === "wrapping") {
      p.status = "done"
      for (const m of p.band) {
        const musician = musicians.find(x => x.id === m.id)
        if (musician) musician.available = true
      }
      changed = true
    }
  }
  if (changed) await Promise.all([savePerformances(performances), saveMusicians(musicians)])
  return NextResponse.json({ ok: true })
}

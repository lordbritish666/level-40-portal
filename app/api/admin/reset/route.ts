import { NextResponse } from "next/server"
import { resetAll } from "@/lib/kv"

export async function POST() {
  await resetAll()
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getMusicians, addMusician, updateMusician } from "@/lib/kv"
import type { Musician } from "@/lib/types"

export async function GET() {
  const musicians = await getMusicians()
  return NextResponse.json(musicians)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, instruments, canSing } = body

  if (!name || !Array.isArray(instruments) || instruments.length === 0) {
    return new NextResponse("Name and at least one instrument required", { status: 400 })
  }

  const musician: Musician = {
    id: uuid(),
    name,
    instruments,
    canSing: !!canSing,
    available: true,
    joinedAt: Date.now(),
  }

  await addMusician(musician)
  return NextResponse.json(musician, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json()
  if (!id) return new NextResponse("ID required", { status: 400 })
  await updateMusician(id, updates)
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"
import { v4 as uuid } from "uuid"
import { getSingers, addSinger } from "@/lib/kv"
import type { Singer } from "@/lib/types"

export async function GET() {
  const singers = await getSingers()
  return NextResponse.json(singers)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, songs, canPlayInstrument, instrument } = body

  if (!name || !Array.isArray(songs) || songs.length < 1 || songs.length > 3 || songs.some((s: string) => !s?.trim())) {
    return new NextResponse("Name and at least 1 song required", { status: 400 })
  }

  const singer: Singer = {
    id: uuid(),
    name,
    songs: songs as string[],
    canPlayInstrument: !!canPlayInstrument,
    instrument: canPlayInstrument ? instrument : undefined,
    joinedAt: Date.now(),
  }

  await addSinger(singer)
  return NextResponse.json(singer, { status: 201 })
}

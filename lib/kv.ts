import { kv } from '@vercel/kv'
import type { Musician, Singer, Performance } from './types'

const MUSICIANS_KEY = 'musicians'
const SINGERS_KEY = 'singers'
const PERFORMANCES_KEY = 'performances'

export async function getMusicians(): Promise<Musician[]> {
  const data = await kv.get<Musician[]>(MUSICIANS_KEY)
  return data ?? []
}

export async function saveMusicians(musicians: Musician[]): Promise<void> {
  await kv.set(MUSICIANS_KEY, musicians)
}

export async function addMusician(musician: Musician): Promise<void> {
  const musicians = await getMusicians()
  musicians.push(musician)
  await saveMusicians(musicians)
}

export async function updateMusician(id: string, updates: Partial<Musician>): Promise<void> {
  const musicians = await getMusicians()
  const idx = musicians.findIndex(m => m.id === id)
  if (idx !== -1) {
    musicians[idx] = { ...musicians[idx], ...updates }
    await saveMusicians(musicians)
  }
}

export async function getSingers(): Promise<Singer[]> {
  const data = await kv.get<Singer[]>(SINGERS_KEY)
  return data ?? []
}

export async function saveSingers(singers: Singer[]): Promise<void> {
  await kv.set(SINGERS_KEY, singers)
}

export async function addSinger(singer: Singer): Promise<void> {
  const singers = await getSingers()
  singers.push(singer)
  await saveSingers(singers)
}

export async function getPerformances(): Promise<Performance[]> {
  const data = await kv.get<Performance[]>(PERFORMANCES_KEY)
  return data ?? []
}

export async function savePerformances(performances: Performance[]): Promise<void> {
  await kv.set(PERFORMANCES_KEY, performances)
}

export async function addPerformance(performance: Performance): Promise<void> {
  const performances = await getPerformances()
  performances.push(performance)
  await savePerformances(performances)
}

export async function updatePerformance(id: string, updates: Partial<Performance>): Promise<void> {
  const performances = await getPerformances()
  const idx = performances.findIndex(p => p.id === id)
  if (idx !== -1) {
    performances[idx] = { ...performances[idx], ...updates }
    await savePerformances(performances)
  }
}

export async function hasVoted(performanceId: string, voterId: string): Promise<boolean> {
  const voted = await kv.sismember(`votes:${performanceId}`, voterId)
  return voted === 1
}

export async function recordVote(performanceId: string, voterId: string): Promise<void> {
  await kv.sadd(`votes:${performanceId}`, voterId)
}

export async function resetAll(): Promise<void> {
  await kv.del(MUSICIANS_KEY, SINGERS_KEY, PERFORMANCES_KEY)
}

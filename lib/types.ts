export type Instrument = 'bass' | 'drums' | 'keys' | 'guitar' | 'misc'

export interface Musician {
  id: string
  name: string
  instruments: string[]  // preset Instrument values or custom strings
  canSing: boolean
  available: boolean
  joinedAt: number
}

export interface Singer {
  id: string
  name: string
  songs: string[]  // 1–3 songs
  canPlayInstrument: boolean
  instrument?: string
  joinedAt: number
}

export type PerformanceStatus = 'queued' | 'live' | 'wrapping' | 'done'

export interface Performance {
  id: string
  singer?: Singer
  title: string        // song name or set title — always set
  band: Musician[]
  status: PerformanceStatus
  votes: number
  createdAt: number
}

export const INSTRUMENT_LABELS: Record<string, string> = {
  bass: 'Bassist',
  drums: 'Drummer',
  keys: 'Keyboardist',
  guitar: 'Guitarist',
  misc: 'Other Instrument',
}

export const INSTRUMENT_ICONS: Record<string, string> = {
  bass: '🎸',
  drums: '🥁',
  keys: '🎹',
  guitar: '🎸',
  misc: '🎵',
}

export function instIcon(inst: string): string {
  return INSTRUMENT_ICONS[inst] ?? '🎵'
}

export function instLabel(inst: string): string {
  return INSTRUMENT_LABELS[inst] ?? inst
}

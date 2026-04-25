export type Instrument = 'bass' | 'drums' | 'keys' | 'guitar' | 'misc'

export interface Musician {
  id: string
  name: string
  instrument: Instrument
  canSing: boolean
  available: boolean
  joinedAt: number
}

export interface Singer {
  id: string
  name: string
  songs: [string, string, string]
  canPlayInstrument: boolean
  instrument?: Instrument
  joinedAt: number
}

export type PerformanceStatus = 'queued' | 'live' | 'done'

export interface Performance {
  id: string
  singer: Singer
  song: string
  band: Musician[]
  status: PerformanceStatus
  votes: number
  createdAt: number
}

export const INSTRUMENT_LABELS: Record<Instrument, string> = {
  bass: 'Bassist',
  drums: 'Drummer',
  keys: 'Keyboardist',
  guitar: 'Guitarist',
  misc: 'Other Instrument',
}

export const INSTRUMENT_ICONS: Record<Instrument, string> = {
  bass: '🎸',
  drums: '🥁',
  keys: '🎹',
  guitar: '🎸',
  misc: '🎵',
}

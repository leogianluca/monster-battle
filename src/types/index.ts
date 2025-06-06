import type { Monster } from '../domain/entities/Monster'

export type BattleStatus = 'IN_PROGRESS' | 'FINISHED' | 'DRAW'

export const BattleStatus = {
  InProgress: 'IN_PROGRESS' as BattleStatus,
  Finished: 'FINISHED' as BattleStatus,
  Draw: 'DRAW' as BattleStatus,
}

export type BattleSummary = {
  winner?: Monster
  status: BattleStatus
  roundsCount: number
}

export type BattleStartInput = {
  monsterA: Monster
  monsterB: Monster
  maxRounds?: number
}

export type MonsterCreateInput = {
  name: string
  hp: number
  attack: number
  defense: number
  speed: number
  imageUrl: string
}

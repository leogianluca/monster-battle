import { RoundResult } from '../domain/entities/RoundResult'
import { BattleResult } from '../domain/entities/BattleResult'
import type { Monster } from '../domain/entities/Monster'
import { BattleEngine } from '../domain/battle/BattleEngine'

export function* startBattle(monsterA: Monster, monsterB: Monster): Generator<RoundResult, BattleResult, unknown> {
  const engine = new BattleEngine(monsterA, monsterB)

  for (const round of engine.runRounds()) {
    yield round
  }

  return engine.getResult()
}

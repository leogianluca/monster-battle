import { Monster } from '../domain/entities/Monster'
import { RoundResult } from '../domain/entities/RoundResult'
import { BattleResult } from '../domain/entities/BattleResult'
import { MAX_ROUNDS } from '../domain/rules/constants'

export function startBattle(monsterA: Monster, monsterB: Monster): BattleResult {
  let attacker = monsterA.clone()
  let defender = monsterB.clone()

  if (
    defender.speed > attacker.speed ||
    (defender.speed === attacker.speed && defender.attack > attacker.attack)
  ) {
    [attacker, defender] = [defender, attacker]
  }

  const rounds: RoundResult[] = []

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const damage = Math.max(1, attacker.attack - defender.defense)
    const newHp = Math.max(0, defender.hp - damage)
    defender = defender.withHp(newHp)

    rounds.push(
      new RoundResult({
        roundNumber: round,
        attacker,
        defender,
        damage,
        defenderHpAfter: newHp,
      }),
    )

    if (newHp <= 0) {
      return new BattleResult({
        rounds,
        winner: attacker,
        loser: defender,
        isDraw: false,
        maxRounds: MAX_ROUNDS,
      })
    }

    [attacker, defender] = [defender, attacker]
  }

  return new BattleResult({
    rounds,
    winner: null,
    loser: null,
    isDraw: true,
    maxRounds: MAX_ROUNDS,
  })
}

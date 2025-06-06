import { Monster } from '../entities/Monster'
import { RoundResult } from '../entities/RoundResult'
import { BattleResult } from '../entities/BattleResult'
import { MAX_ROUNDS } from '../rules/constants'

export class BattleEngine {
  private readonly monsterA: Monster
  private readonly monsterB: Monster
  private readonly rounds: RoundResult[] = []
  private readonly maxRounds: number
  private currentRound = 0

  private attackerCurrent: Monster
  private defenderCurrent: Monster

  constructor(monsterA: Monster, monsterB: Monster, maxRounds = MAX_ROUNDS) {
    this.monsterA = monsterA.clone()
    this.monsterB = monsterB.clone()
    this.maxRounds = maxRounds

    const [attacker, defender] = this.getAttackOrder(this.monsterA, this.monsterB)
    this.attackerCurrent = attacker.clone()
    this.defenderCurrent = defender.clone()
  }

  public *runRounds(): Generator<RoundResult, void, unknown> {
    if (this.attackerCurrent.hp <= 0 || this.defenderCurrent.hp <= 0) {
      const winner = this.attackerCurrent.hp > 0 ? this.attackerCurrent : this.defenderCurrent
      const loser = this.attackerCurrent.hp > 0 ? this.defenderCurrent : this.attackerCurrent
      this.rounds.push(
        RoundResult.instantDefeat(winner, loser, 1)
      )
      return
    }

    while (this.currentRound < this.maxRounds) {
      this.currentRound++
      const defenderHpBefore = this.defenderCurrent.hp

      const damage = this.calculateDamage(this.attackerCurrent, this.defenderCurrent)
      const newHp = Math.max(0, this.defenderCurrent.hp - damage)

      this.defenderCurrent = this.defenderCurrent.withHp(newHp)

      const round = new RoundResult({
        roundNumber: this.currentRound,
        attacker: this.attackerCurrent.clone(),
        defender: this.defenderCurrent.clone(),
        damage,
        defenderHpBefore,
        defenderHpAfter: newHp,
      })

      this.rounds.push(round)

      yield round

      if (newHp <= 0) return

      [this.attackerCurrent, this.defenderCurrent] = [this.defenderCurrent, this.attackerCurrent]
    }
  }

  public getResult(): BattleResult {
    const isDraw = this.attackerCurrent.hp === this.defenderCurrent.hp && this.attackerCurrent.hp > 0

    return BattleResult.finished({
      rounds: this.rounds,
      winner: isDraw ? null : this.attackerCurrent.hp > this.defenderCurrent.hp ? this.attackerCurrent : this.defenderCurrent,
      loser: isDraw ? null : this.attackerCurrent.hp < this.defenderCurrent.hp ? this.attackerCurrent : this.defenderCurrent,
      isDraw,
      maxRounds: this.maxRounds,
    })
  }

  private getAttackOrder(a: Monster, b: Monster): [Monster, Monster] {
    if (a.speed > b.speed) return [a, b]
    if (b.speed > a.speed) return [b, a]
    if (a.attack > b.attack) return [a, b]
    if (b.attack > a.attack) return [b, a]
    return [a, b]
  }

  private calculateDamage(attacker: Monster, defender: Monster): number {
    return Math.max(1, attacker.attack - defender.defense)
  }
}

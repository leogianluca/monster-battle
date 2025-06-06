import { Monster } from '../entities/Monster'
import { RoundResult } from '../entities/RoundResult'
import { BattleResult } from '../entities/BattleResult'
import { MAX_ROUNDS } from '../rules/constants'

export class BattleEngine {
  private readonly monsterA: Monster
  private readonly monsterB: Monster
  private readonly rounds: RoundResult[] = []
  private readonly maxRounds: number

  constructor(monsterA: Monster, monsterB: Monster, maxRounds = MAX_ROUNDS) {
    this.monsterA = monsterA.clone()
    this.monsterB = monsterB.clone()
    this.maxRounds = maxRounds
  }

  public run(): BattleResult {
    // Caso: algum monstro já está morto
    if (this.monsterA.hp <= 0 || this.monsterB.hp <= 0) {
      const winner = this.monsterA.hp > 0 ? this.monsterA : this.monsterB
      const loser = this.monsterA.hp > 0 ? this.monsterB : this.monsterA
      this.rounds.push(
        RoundResult.instantDefeat(winner, loser, this.rounds.length + 1)
      )
      return BattleResult.finished({
        rounds: this.rounds,
        winner,
        loser,
        isDraw: false,
        maxRounds: this.maxRounds,
      })
    }

    // Define ordem inicial do ataque
    const [attacker, defender] = this.getAttackOrder(this.monsterA, this.monsterB)

    // Clona para manipular HP sem alterar os originais
    let attackerCurrent = attacker.clone()
    let defenderCurrent = defender.clone()

    for (let i = 0; i < this.maxRounds; i++) {
      const defenderHpBefore = defenderCurrent.hp

      const damage = this.calculateDamage(attackerCurrent, defenderCurrent)
      const newHp = Math.max(0, defenderCurrent.hp - damage)

      defenderCurrent = defenderCurrent.withHp(newHp)

      this.rounds.push(new RoundResult({
        roundNumber: i + 1,
        attacker: attackerCurrent.clone(),
        defender: defenderCurrent.clone(),
        damage,
        defenderHpBefore,
        defenderHpAfter: newHp,
      }))

      if (defenderCurrent.hp <= 0) {
        return BattleResult.finished({
          rounds: this.rounds,
          winner: attackerCurrent,
          loser: defenderCurrent,
          isDraw: false,
          maxRounds: this.maxRounds,
        })
      }

      // Troca os papéis para a próxima rodada (atacante vira defensor e vice-versa)
      [attackerCurrent, defenderCurrent] = [defenderCurrent, attackerCurrent]
    }

    // Após máximo de rounds, verifica empate ou vencedor
    const isDraw = attackerCurrent.hp === defenderCurrent.hp && attackerCurrent.hp > 0

    return BattleResult.finished({
      rounds: this.rounds,
      winner: isDraw ? null : attackerCurrent.hp > defenderCurrent.hp ? attackerCurrent : defenderCurrent,
      loser: isDraw ? null : attackerCurrent.hp < defenderCurrent.hp ? attackerCurrent : defenderCurrent,
      isDraw,
      maxRounds: this.maxRounds,
    })
  }

  private getAttackOrder(a: Monster, b: Monster): [Monster, Monster] {
    if (a.speed > b.speed) return [a, b]
    if (b.speed > a.speed) return [b, a]
    if (a.attack > b.attack) return [a, b]
    if (b.attack > a.attack) return [b, a]
    return [a, b] // empate técnico: A ataca primeiro
  }

  private calculateDamage(attacker: Monster, defender: Monster): number {
    return Math.max(1, attacker.attack - defender.defense)
  }
}

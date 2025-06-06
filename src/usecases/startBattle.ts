import { Monster } from '../domain/entities/Monster'
import { RoundResult, type RoundResultProps } from '../domain/entities/RoundResult'
import { BattleResult, type BattleResultProps } from '../domain/entities/BattleResult'
import { MAX_ROUNDS } from '../domain/rules/constants'

export function startBattle(monsterA: Monster, monsterB: Monster): BattleResult {
  let attacker = monsterA.clone()
  let defender = monsterB.clone()

  // Verifica se algum já está morto no início e encerra imediatamente
  if (attacker.hp <= 0) {
    const round: RoundResultProps = {
      roundNumber: 1,
      attacker: defender.clone(),
      defender: attacker.clone(),
      damage: 0,
      defenderHpBefore: attacker.hp,
      defenderHpAfter: 0,
    }
    const battleResultProps: BattleResultProps = {
      rounds: [round],
      winner: defender,
      loser: attacker,
      isDraw: false,
      maxRounds: MAX_ROUNDS,
    }
    return new BattleResult(battleResultProps)
  }

  if (defender.hp <= 0) {
    const round: RoundResultProps = {
      roundNumber: 1,
      attacker: attacker.clone(),
      defender: defender.clone(),
      damage: 0,
      defenderHpBefore: defender.hp,
      defenderHpAfter: 0,
    }
    const battleResultProps: BattleResultProps = {
      rounds: [round],
      winner: attacker,
      loser: defender,
      isDraw: false,
      maxRounds: MAX_ROUNDS,
    }
    return new BattleResult(battleResultProps)
  }

  // Define ordem inicial por velocidade > ataque
  if (
    defender.speed > attacker.speed ||
    (defender.speed === attacker.speed && defender.attack > attacker.attack)
  ) {
    [attacker, defender] = [defender, attacker]
  }

  const rounds: RoundResult[] = []

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const defenderHpBefore = defender.hp
    const damage = Math.max(1, attacker.attack - defender.defense)
    const defenderHpAfter = Math.max(0, defenderHpBefore - damage)
    defender = defender.withHp(defenderHpAfter)

    rounds.push(new RoundResult({
      roundNumber: round,
      attacker,
      defender,
      damage,
      defenderHpBefore,
      defenderHpAfter,
    }))

    if (defenderHpAfter <= 0) {
      // Vitória normal
      const battleResultProps: BattleResultProps = {
        winner: attacker,
        loser: defender,
        isDraw: false,
        rounds,
        maxRounds: MAX_ROUNDS,
      }
      return new BattleResult(battleResultProps)
    }

    [attacker, defender] = [defender, attacker]
  }

  // Caso chegou ao limite de rounds, quem tiver maior HP vence
  if (attacker.hp > defender.hp) {
    const battleResultProps: BattleResultProps = {
      winner: attacker,
      loser: defender,
      isDraw: false,
      rounds,
      maxRounds: MAX_ROUNDS,
    }
    return new BattleResult(battleResultProps)
  } else if (defender.hp > attacker.hp) {
    const battleResultProps: BattleResultProps = {
      winner: defender,
      loser: attacker,
      isDraw: false,
      rounds,
      maxRounds: MAX_ROUNDS,
    }
    return new BattleResult(battleResultProps)
  } else {
    // empate
    const battleResultProps: BattleResultProps = {
      winner: null,
      loser: null,
      isDraw: true,
      rounds,
      maxRounds: MAX_ROUNDS,
    }
    return new BattleResult(battleResultProps)
  }
}

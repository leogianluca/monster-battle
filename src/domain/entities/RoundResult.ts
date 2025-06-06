import { Monster } from './Monster'

export type RoundResultProps = {
  roundNumber: number
  attacker: Monster
  defender: Monster
  damage: number
  defenderHpBefore: number
  defenderHpAfter: number
}

export class RoundResult {
  public readonly roundNumber: number
  public readonly attacker: Monster
  public readonly defender: Monster
  public readonly damage: number
  public readonly defenderHpBefore: number
  public readonly defenderHpAfter: number

  constructor(props: RoundResultProps) {
    this.roundNumber = props.roundNumber
    this.attacker = props.attacker.clone()
    this.defender = props.defender.clone()
    this.damage = props.damage
    this.defenderHpBefore = props.defenderHpBefore
    this.defenderHpAfter = Math.max(0, props.defenderHpAfter)
  }

  static instantDefeat(attacker: Monster, defender: Monster, roundNumber: number): RoundResult {
    return new RoundResult({
      roundNumber,
      attacker,
      defender,
      damage: defender.hp,
      defenderHpBefore: defender.hp,
      defenderHpAfter: 0,
    })
  }

  clone(): RoundResult {
    return new RoundResult({
      roundNumber: this.roundNumber,
      attacker: this.attacker.clone(),
      defender: this.defender.clone(),
      damage: this.damage,
      defenderHpBefore: this.defenderHpBefore,
      defenderHpAfter: this.defenderHpAfter,
    })
  }
}

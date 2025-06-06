import { RoundResult, type RoundResultProps } from './RoundResult'
import { Monster } from './Monster'

export type BattleResultProps = {
  rounds: RoundResultProps[]
  winner: Monster | null
  loser: Monster | null
  isDraw: boolean
  maxRounds: number
}

export class BattleResult {
  public readonly rounds: RoundResult[]
  public readonly winner: Monster | null
  public readonly loser: Monster | null
  public readonly isDraw: boolean
  public readonly maxRounds: number

  constructor(props: BattleResultProps) {
    this.rounds = props.rounds.map(r => new RoundResult(r))
    this.winner = props.winner ? props.winner.clone() : null
    this.loser = props.loser ? props.loser.clone() : null
    this.isDraw = props.isDraw
    this.maxRounds = props.maxRounds
  }

  static finished(props: {
    winner: Monster | null
    loser: Monster | null
    isDraw: boolean
    rounds: RoundResult[]
    maxRounds: number
  }): BattleResult {
    const roundsProps = props.rounds.map(r => ({
      roundNumber: r.roundNumber,
      attacker: r.attacker,
      defender: r.defender,
      damage: r.damage,
      defenderHpBefore: r.defenderHpBefore,
      defenderHpAfter: r.defenderHpAfter,
    }))

    return new BattleResult({
      winner: props.winner,
      loser: props.loser,
      isDraw: props.isDraw,
      rounds: roundsProps,
      maxRounds: props.maxRounds,
    })
  }

}

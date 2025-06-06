import { BattleResult } from '../domain/entities/BattleResult'

export class BattleRepository {
  private static battles: BattleResult[] = []

  public static add(battle: BattleResult): void {
    this.battles.push(battle)
  }

  public static getAll(): BattleResult[] {
    return this.battles.map(b => b.clone())
  }

  public static getByIndex(index: number): BattleResult | undefined {
    const battle = this.battles[index]
    return battle?.clone()
  }

  public static removeByIndex(index: number): void {
    if (index >= 0 && index < this.battles.length) {
      this.battles.splice(index, 1)
    }
  }

  public static clear(): void {
    this.battles = []
  }
}

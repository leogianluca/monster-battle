import { Monster } from '../domain/entities/Monster'

export class MonsterRepository {
  private static monsters: Monster[] = []

  public static add(monster: Monster): void {
    const exists = this.monsters.some(m => m.name === monster.name)
    if (!exists) {
      this.monsters.push(monster)
    } else {
      // Por enquanto ignora duplicado
    }
  }

  public static getAll(): Monster[] {
    return this.monsters.map(m => m.clone())
  }

  public static findByName(name: string): Monster | undefined {
    const found = this.monsters.find(m => m.name === name)
    return found?.clone()
  }

  public static removeByName(name: string): void {
    this.monsters = this.monsters.filter(m => m.name !== name)
  }

  public static clear(): void {
    this.monsters = []
  }
}

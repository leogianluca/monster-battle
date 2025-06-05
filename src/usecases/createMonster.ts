import { Monster, MonsterSchema, type MonsterProps } from '../domain/entities/Monster'

export function createMonster(data: unknown): Monster {
  const parsedData: MonsterProps = MonsterSchema.parse(data)
  return new Monster(parsedData)
}

import { ZodError } from 'zod'
import { Monster, MonsterSchema, type MonsterProps } from '../domain/entities/Monster'
import type { MonsterCreateInput } from '../types'

export function createMonster(data: MonsterCreateInput): Monster {
  const parsedData: MonsterProps = MonsterSchema.parse(data)

  if (parsedData.hp === 0) {
    throw new ZodError([
      {
        code: 'too_small',
        minimum: 1,
        type: 'number',
        inclusive: true,
        message: 'HP deve ser maior que 0',
        path: ['hp'],
      }
    ])
  }

  return new Monster(parsedData)
}

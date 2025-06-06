import { z } from 'zod'

export const MonsterSchema = z.object({
  name: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        const trimmed = val.trim()
        return trimmed.length > 0 ? trimmed : undefined
      }
      return val
    },
    z.string().min(1, { message: 'Nome é obrigatório e não pode ser vazio' })
  ),
  attack: z.number().int().gt(0, { message: 'Attack deve ser maior que 0' }),
  defense: z.number().int().gt(0, { message: 'Defense deve ser maior que 0' }),
  speed: z.number().int().gt(0, { message: 'Speed deve ser maior que 0' }),
  hp: z.number().int().gte(0, { message: 'HP deve ser maior ou igual a 0' }),
  imageUrl: z.string().url(),
})

export type MonsterProps = z.infer<typeof MonsterSchema>

export class Monster {
  public readonly name!: string
  public readonly attack!: number
  public readonly defense!: number
  public readonly speed!: number
  public readonly hp!: number
  public readonly imageUrl!: string

  constructor(props: MonsterProps) {
    MonsterSchema.parse(props)
    Object.assign(this, props)
  }

  clone(): Monster {
    return new Monster({ ...this })
  }

  withHp(newHp: number): Monster {
    // Aqui é permitido hp 0, pois representa morte.
    return new Monster({
      ...this,
      hp: Math.max(0, newHp),
    })
  }
}

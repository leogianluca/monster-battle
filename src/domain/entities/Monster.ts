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
  attack: z.number().int().min(0),
  defense: z.number().int().min(0),
  speed: z.number().int().min(0),
  hp: z.number().int().min(1),
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
    return new Monster({
      ...this,
      hp: Math.max(0, newHp),
    })
  }
}

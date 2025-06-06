import { z } from 'zod'

const positiveInt = (message: string) => z.number().int().gt(0, { message })
const nonEmptyString = z.preprocess(
  (val) => (typeof val === 'string' && val.trim().length > 0 ? val.trim() : undefined),
  z.string().min(1, { message: 'Campo obrigatório e não pode ser vazio' })
)

export const MonsterSchema = z.object({
  name: nonEmptyString,
  attack: positiveInt('Attack deve ser maior que 0'),
  defense: positiveInt('Defense deve ser maior que 0'),
  speed: positiveInt('Speed deve ser maior que 0'),
  hp: z.number().int().gte(0, { message: 'HP deve ser maior ou igual a 0' }),
  imageUrl: z.string().min(1, { message: 'Image URL é obrigatória' }).url({ message: 'Image URL deve ser uma URL válida' }),
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

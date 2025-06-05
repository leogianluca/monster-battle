import { createMonster } from '../../src/usecases/createMonster'
import { ZodError } from 'zod'

describe('createMonster', () => {
  // Base válida para reutilizar e evitar repetição
  const validMonsterInput = {
    name: "Valid Monster",
    attack: 10,
    defense: 5,
    hp: 30,
    speed: 15,
    imageUrl: "https://example.com/monster.png",
  }

  it('cria um monstro válido com nome e atributos corretos', () => {
    const monster = createMonster({
      ...validMonsterInput,
      name: 'Draco',
      attack: 10,
      defense: 8,
      hp: 50,
      imageUrl: validMonsterInput.imageUrl,
      speed: validMonsterInput.speed,
    })

    expect(monster.name).toBe('Draco')
    expect(monster.attack).toBe(10)
    expect(monster.defense).toBe(8)
    expect(monster.hp).toBe(50)
  })

  it('falha ao criar monstro com nome vazio', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: '' })
    ).toThrowError(ZodError)
  })

  it('falha ao criar monstro com nome apenas espaços', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: '   ' })
    ).toThrowError(ZodError)
  })

  it('falha ao criar monstro com ataque negativo', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Goblin', attack: -1 })
    ).toThrowError(ZodError)
  })

  it('cria monstro com ataque no limite mínimo válido (ex: 0)', () => {
    const monster = createMonster({ ...validMonsterInput, name: 'Weakling', attack: 0 })
    expect(monster.attack).toBe(0)
  })

  it('falha ao criar monstro com defesa negativa', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Orc', defense: -3 })
    ).toThrowError(ZodError)
  })

  it('cria monstro com defesa no limite mínimo válido (ex: 0)', () => {
    const monster = createMonster({ ...validMonsterInput, name: 'Shieldless', defense: 0 })
    expect(monster.defense).toBe(0)
  })

  it('falha ao criar monstro com hp negativo', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Troll', hp: -10 })
    ).toThrowError(ZodError)
  })

  it('cria monstro com hp no limite mínimo válido (ex: 1)', () => {
    const monster = createMonster({ ...validMonsterInput, name: 'Fragile', hp: 1 })
    expect(monster.hp).toBe(1)
  })

  it('falha ao criar monstro com ataque decimal', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal Attack', attack: 5.5 })
    ).toThrowError(ZodError)
  })

  it('falha ao criar monstro com defesa decimal', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal Defense', defense: 3.3 })
    ).toThrowError(ZodError)
  })

  it('falha ao criar monstro com hp decimal', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal HP', hp: 10.7 })
    ).toThrowError(ZodError)
  })

  it('falha ao criar monstro com atributos de tipo incorreto', () => {
    expect(() =>
      createMonster({
        name: 123 as unknown as string,
        attack: 'high' as unknown as number,
        defense: 'strong' as unknown as number,
        hp: 'full' as unknown as number,
        speed: 10,
        imageUrl: validMonsterInput.imageUrl,
      })
    ).toThrowError(ZodError)
  })

  it('ignora propriedades extras não definidas no esquema', () => {
    type MonsterWithExtra = typeof validMonsterInput & { extraProp?: unknown }
    const input: MonsterWithExtra = {
      ...validMonsterInput,
      name: 'ExtraProp',
      extraProp: 'I should be ignored',
    }
    const monster = createMonster(input)
    expect(monster.name).toBe('ExtraProp')
    expect(monster).not.toHaveProperty('extraProp')
  })
})

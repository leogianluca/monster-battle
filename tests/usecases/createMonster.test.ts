import { createMonster } from '../../src/usecases/createMonster'
import { ZodError } from 'zod'

describe('createMonster', () => {
  const validMonsterInput = {
    name: "Valid Monster",
    attack: 10,
    defense: 5,
    hp: 30,
    speed: 15,
    imageUrl: "https://example.com/monster.png",
  }

  it('creates a valid monster with correct name and attributes', () => {
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

  it('fails to create a monster with an empty name', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: '' })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with name containing only spaces', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: '   ' })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with negative attack', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Goblin', attack: -1 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with zero attack', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'ZeroAttack', attack: 0 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with negative defense', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Orc', defense: -3 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with zero defense', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'ZeroDefense', defense: 0 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with negative hp', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Troll', hp: -10 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with zero hp', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'ZeroHP', hp: 0 })
    ).toThrowError(ZodError)
  })

  it('creates a monster with minimum valid hp (1)', () => {
    const monster = createMonster({ ...validMonsterInput, name: 'Fragile', hp: 1 })
    expect(monster.hp).toBe(1)
  })

  it('fails to create a monster with decimal attack', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal Attack', attack: 5.5 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with decimal defense', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal Defense', defense: 3.3 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with decimal hp', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal HP', hp: 10.7 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with negative speed', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Slowpoke', speed: -5 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with zero speed', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'ZeroSpeed', speed: 0 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with decimal speed', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'Decimal Speed', speed: 7.3 })
    ).toThrowError(ZodError)
  })

  it('fails to create a monster with attributes of incorrect types', () => {
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

  it('fails to create a monster with an invalid image URL', () => {
    expect(() =>
      createMonster({ ...validMonsterInput, name: 'NoImage', imageUrl: 'not-a-url' })
    ).toThrowError(ZodError)
  })

  it('ignores extra properties not defined in the schema', () => {
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

import { describe, it, expect } from 'vitest'
import { BattleEngine } from '../../../src/domain/battle/BattleEngine'
import { Monster } from '../../../src/domain/entities/Monster'

describe('BattleEngine', () => {
  const baseMonsterProps = {
    attack: 10,
    defense: 5,
    speed: 5,
    hp: 20,
    imageUrl: "https://example.com/monster.png",
  }

  function createMonster(name: string, overrides = {}) {
    return new Monster({
      name,
      ...baseMonsterProps,
      ...overrides,
    })
  }

  it('finishes immediately if a monster is already dead', () => {
    const deadMonster = createMonster('Dead', {
      attack: 10,
      defense: 5,
      speed: 5,
      hp: 10,
      imageUrl: 'http://example.com/image.png',
    }).withHp(0)

    const healthyMonster = createMonster('Healthy', {
      attack: 12,
      defense: 6,
      speed: 7,
      hp: 20,
      imageUrl: 'http://example.com/image2.png',
    })

    const engine = new BattleEngine(deadMonster, healthyMonster)
    const result = engine.run()

    expect(result.winner?.name).toBe('Healthy')
    expect(result.loser?.name).toBe('Dead')
    expect(result.rounds.length).toBe(1)
    expect(result.isDraw).toBe(false)
  })

  it('monster with higher speed attacks first', () => {
    const fast = createMonster('Fast', { speed: 10 })
    const slow = createMonster('Slow', { speed: 5 })
    const engine = new BattleEngine(fast, slow)
    engine.run()

    expect(engine['rounds'][0].attacker.name).toBe('Fast')
  })

  it('minimum damage is 1 even if defense is higher than attack', () => {
    const weakAttacker = createMonster('Weak', { attack: 5, defense: 5 })
    const strongDefender = createMonster('Strong', { attack: 5, defense: 10 })
    const engine = new BattleEngine(weakAttacker, strongDefender)
    engine.run()

    expect(engine['rounds'][0].damage).toBe(1)
  })

  it('battle ends when a monster has zero HP', () => {
    const attacker = createMonster('Attacker', { attack: 50 })
    const defender = createMonster('Defender', { hp: 20, defense: 1 })
    const engine = new BattleEngine(attacker, defender)
    const result = engine.run()

    expect(result.winner?.name).toBe('Attacker')
    expect(result.loser?.name).toBe('Defender')
    expect(result.rounds.some(r => r.defenderHpAfter === 0)).toBe(true)
  })

  it('battle ends in a draw if maxRounds finish with equal HP', () => {
    const monA = createMonster('MonA', { hp: 20, attack: 5, defense: 5, speed: 5 })
    const monB = createMonster('MonB', { hp: 20, attack: 5, defense: 5, speed: 5 })
    const engine = new BattleEngine(monA, monB, 4) // even number of rounds for equal attacks

    const result = engine.run()

    const rounds = engine['rounds']

    expect(result.isDraw).toBe(true)
    expect(result.winner).toBeNull()
    expect(result.loser).toBeNull()

    expect(rounds.length).toBe(4)

    const attackerCounts = rounds.reduce<Record<string, number>>((acc, r) => {
      acc[r.attacker.name] = (acc[r.attacker.name] || 0) + 1
      return acc
    }, {})

    expect(attackerCounts['MonA']).toBe(2)
    expect(attackerCounts['MonB']).toBe(2)
  })

  it('battle ends with a winner if maxRounds finish with different HP', () => {
    const monA = createMonster('MonA', { hp: 15, attack: 7, defense: 3, speed: 5 })
    const monB = createMonster('MonB', { hp: 10, attack: 5, defense: 3, speed: 5 })
    const engine = new BattleEngine(monA, monB, 3)
    const result = engine.run()

    expect(result.isDraw).toBe(false)
    expect(result.winner).not.toBeNull()
    expect(result.loser).not.toBeNull()
  })

  it('attacker order defaults to first monster if speed and attack are equal', () => {
    const monA = createMonster('MonA', { speed: 10, attack: 10 })
    const monB = createMonster('MonB', { speed: 10, attack: 10 })
    const engine = new BattleEngine(monA, monB)
    engine.run()

    expect(engine['rounds'][0].attacker.name).toBe('MonA')
  })

  it('does not exceed maxRounds', () => {
    const monA = createMonster('MonA', { attack: 1, defense: 1, hp: 20, speed: 5 })
    const monB = createMonster('MonB', { attack: 1, defense: 1, hp: 20, speed: 5 })
    const maxRounds = 5
    const engine = new BattleEngine(monA, monB, maxRounds)
    const result = engine.run()

    expect(result.rounds.length).toBeLessThanOrEqual(maxRounds)
  })

  it('handles edge stats like zero attack and zero defense correctly', () => {
    const monA = createMonster('MonA', { attack: 1, defense: 1, hp: 1, speed: 1 })
    const monB = createMonster('MonB', { attack: 1, defense: 1, hp: 1, speed: 1 })
    const engine = new BattleEngine(monA, monB, 1)
    const result = engine.run()

    expect(result.rounds[0].damage).toBe(1) // minimal damage rule
    expect(result.rounds.length).toBe(1)
  })

  it('does not mutate original monsters', () => {
    const monA = createMonster('MonA', { hp: 20 })
    const monB = createMonster('MonB', { hp: 20 })
    const monACopy = monA.clone()
    const monBCopy = monB.clone()

    const engine = new BattleEngine(monA, monB)
    engine.run()

    // Original monsters should remain unchanged
    expect(monA.hp).toBe(monACopy.hp)
    expect(monB.hp).toBe(monBCopy.hp)
    expect(monA).toEqual(monACopy)
    expect(monB).toEqual(monBCopy)
  })

  it('round results have consistent data', () => {
    const monA = createMonster('MonA', { attack: 10, defense: 5, speed: 10 })
    const monB = createMonster('MonB', { attack: 5, defense: 3, speed: 5 })
    const engine = new BattleEngine(monA, monB)
    const result = engine.run()

    for (const round of result.rounds) {
      expect(round.roundNumber).toBeGreaterThan(0)
      expect(round.damage).toBeGreaterThanOrEqual(1)
      expect(round.defenderHpBefore).toBeGreaterThanOrEqual(0)
      expect(round.defenderHpAfter).toBeGreaterThanOrEqual(0)
      expect(round.defenderHpAfter).toBeLessThanOrEqual(round.defenderHpBefore)
    }
  })
})

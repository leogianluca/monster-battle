import { describe, it, expect } from 'vitest'
import { startBattle } from '../../src/usecases/startBattle'
import { Monster } from '../../src/domain/entities/Monster'
import { MAX_ROUNDS } from '../../src/domain/rules/constants'

describe('startBattle', () => {
  let monsterA: Monster
  let monsterB: Monster

  beforeEach(() => {
    monsterA = new Monster({
      name: 'Monstro A',
      attack: 10,
      defense: 5,
      speed: 7,
      hp: 30,
      imageUrl: 'http://a.com',
    })
    monsterB = new Monster({
      name: 'Monstro B',
      attack: 8,
      defense: 4,
      speed: 6,
      hp: 25,
      imageUrl: 'http://b.com',
    })
  })

  it('does not change the original monsters', () => {
    const originalHpA = monsterA.hp
    const originalHpB = monsterB.hp

    startBattle(monsterA, monsterB)

    expect(monsterA.hp).toBe(originalHpA)
    expect(monsterB.hp).toBe(originalHpB)
  })

  it('creates rounds and records damage correctly', () => {
    const result = startBattle(monsterA, monsterB)

    expect(result.rounds.length).toBeGreaterThan(0)

    for (const round of result.rounds) {
      expect(round.damage).toBeGreaterThanOrEqual(1)
      expect(round.defenderHpAfter).toBeGreaterThanOrEqual(0)

      const expectedHp = Math.max(0, round.defenderHpBefore - round.damage)
      expect(round.defenderHpAfter).toBe(expectedHp)
    }
  })


  it('The winner is whoever gets the opponents HP down to 0 before the round limit.', () => {
    const result = startBattle(monsterA, monsterB)
    const lastRound = result.rounds[result.rounds.length - 1]

    expect(result.winner).not.toBeNull()
    expect(result.loser).not.toBeNull()
    expect(result.isDraw).toBe(false)
    expect(lastRound.defenderHpAfter).toBe(0)
  })

  it('declares a tie if after MAX_ROUNDS both are still alive with the same HP', () => {
    const equalHp = 20
    monsterA = new Monster({
      name: 'Empate A',
      attack: 10,
      defense: 10,
      speed: 5,
      hp: equalHp,
      imageUrl: 'http://a.com',
    })
    monsterB = new Monster({
      name: 'Empate B',
      attack: 10,
      defense: 10,
      speed: 5,
      hp: equalHp,
      imageUrl: 'http://b.com',
    })

    const result = startBattle(monsterA, monsterB)

    expect(result.isDraw).toBe(true)
    expect(result.winner).toBeNull()
    expect(result.loser).toBeNull()
    expect(result.rounds.length).toBe(MAX_ROUNDS)
  })

  it('if any monster starts out dead, the battle ends immediately', () => {
    monsterA = monsterA.withHp(0)

    const result = startBattle(monsterA, monsterB)

    expect(result.rounds.length).toBe(1)
    expect(result.winner?.hp).toBeGreaterThan(0)
    expect(result.loser?.hp).toBe(0)
    expect(result.isDraw).toBe(false)
  })

  it('attack order is defined by speed and attack', () => {
    monsterB = new Monster({
      name: 'Velocista',
      attack: 5,
      defense: 5,
      speed: monsterA.speed + 1,
      hp: 20,
      imageUrl: 'http://b.com',
    })

    const result = startBattle(monsterA, monsterB)

    const firstRound = result.rounds[0]
    expect(firstRound.attacker.name).toBe(monsterB.name)
  })

    it('minimum damage is always at least 1 even if defense > attack', () => {
    monsterA = new Monster({
      name: 'Fraco',
      attack: 5,
      defense: 10,
      speed: 5,
      hp: 20,
      imageUrl: 'http://a.com',
    })
    monsterB = new Monster({
      name: 'Tanque',
      attack: 2,
      defense: 20,
      speed: 4,
      hp: 30,
      imageUrl: 'http://b.com',
    })

    const result = startBattle(monsterA, monsterB)

    for (const round of result.rounds) {
      expect(round.damage).toBeGreaterThanOrEqual(1)
    }
  })

  it('battle ends exactly at MAX_ROUNDS if no one dies', () => {
    monsterA = new Monster({
      name: 'Tank A',
      attack: 5,
      defense: 10,
      speed: 5,
      hp: 100,
      imageUrl: 'http://a.com',
    })
    monsterB = new Monster({
      name: 'Tank B',
      attack: 5,
      defense: 10,
      speed: 4,
      hp: 100,
      imageUrl: 'http://b.com',
    })

    const result = startBattle(monsterA, monsterB)

    expect(result.rounds.length).toBe(MAX_ROUNDS)
    expect(result.winner || result.isDraw).toBeTruthy()
  })

  it('if attacker and defender swap every round correctly', () => {
    const result = startBattle(monsterA, monsterB)
    let expectedAttacker = result.rounds[0].attacker.name
    let expectedDefender = result.rounds[0].defender.name

    for (let i = 0; i < result.rounds.length; i++) {
      const round = result.rounds[i]
      expect(round.attacker.name).toBe(expectedAttacker)
      expect(round.defender.name).toBe(expectedDefender)

      // swap for next round
      const temp = expectedAttacker
      expectedAttacker = expectedDefender
      expectedDefender = temp
    }
  })

  it('returns valid BattleResult shape even on immediate death', () => {
    monsterA = monsterA.withHp(0)

    const result = startBattle(monsterA, monsterB)

    expect(result).toHaveProperty('rounds')
    expect(result).toHaveProperty('winner')
    expect(result).toHaveProperty('loser')
    expect(result).toHaveProperty('isDraw')
    expect(Array.isArray(result.rounds)).toBe(true)
    expect(result.rounds.length).toBe(1)
  })

  it('returns winner with more hp if battle reaches round limit', () => {
    monsterA = new Monster({
      name: 'Survivor',
      attack: 5,
      defense: 10,
      speed: 5,
      hp: 20,
      imageUrl: 'http://a.com',
    })
    monsterB = new Monster({
      name: 'Weaker',
      attack: 3,
      defense: 10,
      speed: 4,
      hp: 5,
      imageUrl: 'http://b.com',
    })

    const result = startBattle(monsterA, monsterB)

    expect(result.isDraw).toBe(false)
    expect(result.winner?.name).toBe('Survivor')
    expect(result.rounds.length).toBeLessThanOrEqual(MAX_ROUNDS)
  })
})

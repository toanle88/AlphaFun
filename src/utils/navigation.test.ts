import { describe, expect, it } from 'vitest'
import {
  advanceNavigation,
  buildPool,
  getItemPosition,
  resetNavigation,
  resetNavigationToFirst,
} from './navigation'

describe('learning navigation', () => {
  it('builds complete, uniquely identified category pools', () => {
    const pool = buildPool('all')
    const ids = pool.map((item) => item.id)

    expect(pool).toHaveLength(89)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.includes(':'))).toBe(true)
    expect(buildPool('shapes').map((item) => item.id)).toEqual([
      'shape:circle',
      'shape:square',
      'shape:triangle',
      'shape:star',
      'shape:heart',
      'shape:rectangle',
      'shape:diamond',
      'shape:oval',
      'shape:hexagon',
    ])
  })

  it('resets sequential navigation to the first item in a new category', () => {
    const numbers = buildPool('numbers')
    const afterReset = resetNavigation(numbers, 'sequential')
    const afterNext = advanceNavigation(numbers, 'sequential', afterReset)

    expect(afterReset).toEqual({ currentItemId: 'number:1', sequentialIndex: 1 })
    expect(afterNext).toEqual({ currentItemId: 'number:2', sequentialIndex: 2 })
    expect(getItemPosition(numbers, afterNext.currentItemId)).toBe(2)
  })

  it('starts every newly selected category at its first item', () => {
    const numbers = buildPool('numbers')

    expect(resetNavigationToFirst(numbers)).toEqual({
      currentItemId: 'number:1',
      sequentialIndex: 1,
    })
  })

  it('wraps sequential navigation at the end of a pool', () => {
    const shapes = buildPool('shapes')
    let state = resetNavigation(shapes, 'sequential')

    for (let index = 0; index < shapes.length; index += 1) {
      state = advanceNavigation(shapes, 'sequential', state)
    }

    expect(state.currentItemId).toBe('shape:circle')
    expect(state.sequentialIndex).toBe(1)
  })

  it('avoids the current item in random navigation and handles a previous item outside the pool', () => {
    const letters = buildPool('letters')
    const first = resetNavigation(letters, 'random', () => 0)
    const next = advanceNavigation(letters, 'random', first, () => 0)
    const afterCategoryChange = resetNavigation(letters, 'random', () => 0, 'number:1')

    expect(first.currentItemId).toBe('letter:A')
    expect(next.currentItemId).toBe('letter:B')
    expect(afterCategoryChange.currentItemId).toBe('letter:A')
  })

  it('returns an empty state for empty pools in every navigation operation', () => {
    const emptyState = { currentItemId: null, sequentialIndex: 0 }

    expect(resetNavigation([], 'random', () => 0)).toEqual(emptyState)
    expect(resetNavigationToFirst([])).toEqual(emptyState)
    expect(
      advanceNavigation([], 'sequential', {
        currentItemId: 'missing',
        sequentialIndex: 4,
      }),
    ).toEqual(emptyState)
  })

  it('keeps a single-item pool stable in sequential and random modes', () => {
    const singleItem = buildPool('numbers').slice(0, 1)

    const sequential = resetNavigation(singleItem, 'sequential')
    expect(sequential).toEqual({ currentItemId: 'number:1', sequentialIndex: 0 })
    expect(advanceNavigation(singleItem, 'sequential', sequential)).toEqual(sequential)

    const random = resetNavigation(singleItem, 'random', () => 0)
    expect(random).toEqual({ currentItemId: 'number:1', sequentialIndex: 0 })
    expect(advanceNavigation(singleItem, 'random', random, () => 0)).toEqual(random)
  })
})

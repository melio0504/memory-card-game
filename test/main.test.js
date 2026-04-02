import { describe, expect, test } from 'vitest'
import {
	evaluateCardSelection,
	mergeGifPools,
	selectBoardFromPool,
	shuffleItems,
	TARGET_STREAK,
} from '../src/utils/gameLogic'

describe('gameLogic', () => {
	test('returns fail when a previously clicked image is selected again', () => {
		const result = evaluateCardSelection(['cat-1', 'cat-2'], 'cat-1')

		expect(result.status).toBe('fail')
		expect(result.streak).toBe(2)
		expect(result.clickedIds).toEqual(['cat-1', 'cat-2'])
	})

	test('returns win when target streak is reached', () => {
		const clicked = Array.from({ length: TARGET_STREAK - 1 }, (_, index) => `cat-${index}`)
		const result = evaluateCardSelection(clicked, 'cat-win')

		expect(result.status).toBe('win')
		expect(result.streak).toBe(TARGET_STREAK)
		expect(result.clickedIds).toHaveLength(TARGET_STREAK)
	})

	test('returns continue while user is under target streak', () => {
		const result = evaluateCardSelection(['cat-1'], 'cat-2')

		expect(result.status).toBe('continue')
		expect(result.streak).toBe(2)
		expect(result.clickedIds).toEqual(['cat-1', 'cat-2'])
	})

	test('mergeGifPools keeps existing items and appends new unique ids', () => {
		const existing = [
			{ id: '1', imageUrl: 'one.png' },
			{ id: '2', imageUrl: 'two.png' },
		]
		const incoming = [
			{ id: '2', imageUrl: 'updated-two.png' },
			{ id: '3', imageUrl: 'three.png' },
		]

		const merged = mergeGifPools(existing, incoming)

		expect(merged).toHaveLength(3)
		expect(merged.map((item) => item.id)).toEqual(['1', '2', '3'])
		expect(merged.find((item) => item.id === '2')?.imageUrl).toBe('two.png')
	})

	test('selectBoardFromPool returns only cards from source pool', () => {
		const pool = Array.from({ length: 20 }, (_, i) => ({ id: String(i) }))

		const selected = selectBoardFromPool(pool, 16)

		expect(selected).toHaveLength(16)
		selected.forEach((item) => {
			expect(pool.some((candidate) => candidate.id === item.id)).toBe(true)
		})
	})

	test('selectBoardFromPool respects bounds for requested card count', () => {
		const pool = [{ id: 'a' }, { id: 'b' }]

		expect(selectBoardFromPool(pool, -5)).toEqual([])
		expect(selectBoardFromPool(pool, 99)).toHaveLength(2)
	})

	test('shuffleItems returns a new array without changing original contents', () => {
		const source = ['a', 'b', 'c', 'd']

		const shuffled = shuffleItems(source)

		expect(shuffled).not.toBe(source)
		expect([...shuffled].sort()).toEqual([...source].sort())
		expect(source).toEqual(['a', 'b', 'c', 'd'])
	})
})

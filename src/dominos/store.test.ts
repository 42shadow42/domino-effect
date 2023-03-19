import { ObservableValue } from '../observables'
import { Store, StoredDomino, StoreKey } from './store'

describe('store', () => {
	const createStoredDomino = (): StoredDomino => [
		{
			delete: jest.fn(),
			get: jest.fn(),
			set: jest.fn(),
			subscribe: jest.fn(),
			unsubscribe: jest.fn(),
			refresh: jest.fn(),
		},
		new ObservableValue<any>('N/A'),
	]
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('should act like store', () => {
		it('should initialize', () => {
			const sut = new Store()

			expect(sut.size).toBe(0)
		})

		it('should not crash on full miss get', () => {
			const sut = new Store()
			const symbol = Symbol()
			const key: StoreKey = [symbol, undefined]

			expect(sut.get(key)).toBe(undefined)
		})

		it('should not crash on partial miss get', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)

			expect(sut.get([symbol, 'test'])).toBe(undefined)
		})

		it('should retrieve stored values with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)

			expect(sut.get(key)).toBe(stored)
		})

		it('should retrieve stored values with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']

			sut.set(key, stored)

			expect(sut.get(key)).toBe(stored)
		})

		it('should know stored values presence with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)

			expect(sut.has(key)).toBe(true)
		})

		it('should know stored values presence with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']

			sut.set(key, stored)

			expect(sut.has(key)).toBe(true)
		})

		it('should not overwrite values with no context', () => {
			const sut = new Store()
			const symbol = Symbol('symbol')
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)
			try {
				sut.set(key, stored)
			} catch (error: any) {
				expect(error.message).toBe(
					`Store already has domino with symbol symbol and context undefined`,
				)
			}

			expect.assertions(1)
		})

		it('should not overwrite values with context', () => {
			const sut = new Store()
			const symbol = Symbol('symbol')
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']

			sut.set(key, stored)
			try {
				sut.set(key, stored)
			} catch (error: any) {
				expect(error.message).toBe(
					`Store already has domino with symbol symbol and context test`,
				)
			}

			expect.assertions(1)
		})

		it('should delete values with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)
			sut.delete(key)

			expect(sut.has(key)).toBe(false)
		})

		it('should delete values with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']

			sut.set(key, stored)
			sut.delete(key)

			expect(sut.has(key)).toBe(false)
		})

		it('should not delete values with shared symbol', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key1: StoreKey = [symbol, 'test']
			const key2: StoreKey = [symbol, undefined]

			sut.set(key1, stored)
			sut.set(key2, stored)
			sut.delete(key1)

			expect(sut.has(key2)).toBe(true)
		})

		it('should not crash on full miss delete', () => {
			const sut = new Store()
			const symbol = Symbol()
			const key: StoreKey = [symbol, undefined]

			expect(sut.delete(key)).toBe(false)
		})

		it('should not crash on partial miss get', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]

			sut.set(key, stored)

			expect(sut.delete([symbol, 'test'])).toBe(false)
		})

		it('should not crash on delete missing value with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const key: StoreKey = [symbol, undefined]

			sut.delete(key)
		})

		it('should not crash on delete missing value with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const key: StoreKey = [symbol, 'test']

			sut.delete(key)
		})

		it('should track size', () => {
			const sut = new Store()
			const stored = createStoredDomino()

			expect(sut.size).toBe(0)

			const symbol1 = Symbol()
			const key1: StoreKey = [symbol1, 'test']
			sut.set(key1, stored)

			expect(sut.size).toBe(1)

			const symbol2 = Symbol()
			const key2: StoreKey = [symbol2, 'test']
			sut.set(key2, stored)

			expect(sut.size).toBe(2)

			const key3: StoreKey = [symbol2, undefined]
			sut.set(key3, stored)

			expect(sut.size).toBe(3)

			sut.delete(key3)

			expect(sut.size).toBe(2)

			sut.delete(key1)

			expect(sut.size).toBe(1)

			sut.delete(key2)

			expect(sut.size).toBe(0)
		})

		it('should iterate entries', () => {
			const sut = new Store()

			const symbol1 = Symbol('symbol1')
			const key1: StoreKey = [symbol1, 'test']
			const stored1 = createStoredDomino()

			sut.set(key1, stored1)

			const symbol2 = Symbol('symbol2')
			const key2: StoreKey = [symbol2, 'test']
			const stored2 = createStoredDomino()
			sut.set(key2, stored2)

			const key3: StoreKey = [symbol2, undefined]
			const stored3 = createStoredDomino()

			sut.set(key3, stored3)

			const entries = sut.entries()
			expect(entries.next()).toStrictEqual({
				done: false,
				value: [key1, stored1],
			})
			expect(entries.next()).toStrictEqual({
				done: false,
				value: [key2, stored2],
			})
			expect(entries.next()).toStrictEqual({
				done: false,
				value: [key3, stored3],
			})
			expect(entries.next()).toStrictEqual({
				done: true,
				value: undefined,
			})
		})

		it('should iterate keys', () => {
			const sut = new Store()

			const symbol1 = Symbol('symbol1')
			const key1: StoreKey = [symbol1, 'test']
			const stored1 = createStoredDomino()

			sut.set(key1, stored1)

			const symbol2 = Symbol('symbol2')
			const key2: StoreKey = [symbol2, 'test']
			const stored2 = createStoredDomino()
			sut.set(key2, stored2)

			const key3: StoreKey = [symbol2, undefined]
			const stored3 = createStoredDomino()

			sut.set(key3, stored3)

			const keys = sut.keys()
			expect(keys.next()).toStrictEqual({
				done: false,
				value: key1,
			})
			expect(keys.next()).toStrictEqual({
				done: false,
				value: key2,
			})
			expect(keys.next()).toStrictEqual({
				done: false,
				value: key3,
			})
			expect(keys.next()).toStrictEqual({
				done: true,
				value: undefined,
			})
		})

		it('should iterate values', () => {
			const sut = new Store()

			const symbol1 = Symbol('symbol1')
			const key1: StoreKey = [symbol1, 'test']
			const stored1 = createStoredDomino()

			sut.set(key1, stored1)

			const symbol2 = Symbol('symbol2')
			const key2: StoreKey = [symbol2, 'test']
			const stored2 = createStoredDomino()
			sut.set(key2, stored2)

			const key3: StoreKey = [symbol2, undefined]
			const stored3 = createStoredDomino()

			sut.set(key3, stored3)

			const values = sut.values()
			expect(values.next()).toStrictEqual({
				done: false,
				value: stored1,
			})
			expect(values.next()).toStrictEqual({
				done: false,
				value: stored2,
			})
			expect(values.next()).toStrictEqual({
				done: false,
				value: stored3,
			})
			expect(values.next()).toStrictEqual({
				done: true,
				value: undefined,
			})
		})

		it('should forEach', () => {
			const sut = new Store()
			const tracker = jest.fn()

			const symbol1 = Symbol('symbol1')
			const key1: StoreKey = [symbol1, 'test']
			const stored1 = createStoredDomino()

			sut.set(key1, stored1)

			const symbol2 = Symbol('symbol2')
			const key2: StoreKey = [symbol2, 'test']
			const stored2 = createStoredDomino()
			sut.set(key2, stored2)

			const key3: StoreKey = [symbol2, undefined]
			const stored3 = createStoredDomino()

			sut.set(key3, stored3)

			sut.forEach(tracker)
			expect(tracker).toBeCalledTimes(3)
			expect(tracker).toBeCalledWith(stored1, key1)
			expect(tracker).toBeCalledWith(stored2, key2)
			expect(tracker).toBeCalledWith(stored3, key3)
		})
	})

	describe('should be observable', () => {
		it('should publish stored values with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]
			const subscriber = jest.fn()
			sut.subscribe(subscriber)

			sut.set(key, stored)

			expect(subscriber).toBeCalledWith('add', [[key, stored]])
		})

		it('should publish stored values with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']
			const subscriber = jest.fn()
			sut.subscribe(subscriber)

			sut.set(key, stored)

			expect(subscriber).toBeCalledWith('add', [[key, stored]])
		})

		it('should not double subscribe', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']
			const subscriber = jest.fn()
			sut.subscribe(subscriber)
			sut.subscribe(subscriber)

			sut.set(key, stored)

			expect(subscriber).toBeCalledTimes(1)
		})

		it('should publish deleted values with no context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, undefined]
			const subscriber = jest.fn()

			sut.set(key, stored)

			sut.subscribe(subscriber)

			sut.delete(key)

			expect(subscriber).toBeCalledWith('remove', [[key, stored]])
		})

		it('should publish deleted values with context', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']
			const subscriber = jest.fn()

			sut.set(key, stored)

			sut.subscribe(subscriber)

			sut.delete(key)

			expect(subscriber).toBeCalledWith('remove', [[key, stored]])
		})

		it('should allow unsubscribing', () => {
			const sut = new Store()
			const symbol = Symbol()
			const stored = createStoredDomino()
			const key: StoreKey = [symbol, 'test']
			const subscriber = jest.fn()
			sut.subscribe(subscriber)
			sut.unsubscribe(subscriber)

			sut.set(key, stored)

			expect(subscriber).toBeCalledTimes(0)
		})
	})
})

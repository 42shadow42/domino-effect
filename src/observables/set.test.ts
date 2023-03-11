import { ObservableSet } from './set'

describe('map', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	describe('should act like set', () => {
		it('should initialize', () => {
			const set = new ObservableSet(['value'])

			expect(set.has('value')).toBe(true)
		})

		it('should add values', () => {
			const set = new ObservableSet<string>()

			set.add('value')

			expect(set.has('value')).toBe(true)
		})

		it('should not add duplicate values', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value')

			expect(set.size).toBe(1)
		})

		it('should delete values', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.delete('value')

			expect(set.has('value')).toBe(false)
		})

		it('should not crash on delete missing value', () => {
			const set = new ObservableSet<string>()

			set.delete('value')
		})

		it('should clear values', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value2')
			set.clear()

			expect(set.has('value')).toBe(false)
			expect(set.has('value2')).toBe(false)
		})

		it('should not crash on clear empty map', () => {
			const set = new ObservableSet<string>()
			set.clear()
		})

		it('should track size', () => {
			const set = new ObservableSet<string>()

			expect(set.size).toBe(0)

			set.add('value')

			expect(set.size).toBe(1)

			set.add('value2')

			expect(set.size).toBe(2)

			set.delete('value')

			expect(set.size).toBe(1)

			set.delete('value2')

			expect(set.size).toBe(0)
		})

		it('should iterate entries', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value2')
			const entries = set.entries()
			expect(entries.next()).toStrictEqual({
				done: false,
				value: ['value', 'value'],
			})
			expect(entries.next()).toStrictEqual({
				done: false,
				value: ['value2', 'value2'],
			})
			expect(entries.next()).toStrictEqual({
				done: true,
				value: undefined,
			})
		})

		it('should iterate keys', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value2')
			const keys = set.keys()
			expect(keys.next()).toStrictEqual({ done: false, value: 'value' })
			expect(keys.next()).toStrictEqual({ done: false, value: 'value2' })
			expect(keys.next()).toStrictEqual({ done: true, value: undefined })
		})

		it('should iterate values', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value2')
			const values = set.values()
			expect(values.next()).toStrictEqual({ done: false, value: 'value' })
			expect(values.next()).toStrictEqual({
				done: false,
				value: 'value2',
			})
			expect(values.next()).toStrictEqual({
				done: true,
				value: undefined,
			})
		})

		it('should forEach', () => {
			const set = new ObservableSet<string>()
			const tracker = jest.fn()

			set.add('value')
			set.add('value2')
			set.forEach(tracker)

			expect(tracker).toBeCalledTimes(2)
			expect(tracker).toBeCalledWith('value', 'value')
			expect(tracker).toBeCalledWith('value2', 'value2')
		})
	})

	describe('should be observable', () => {
		it('should publish stored values', () => {
			const subscriber = jest.fn()
			const set = new ObservableSet<string>()
			set.subscribe(subscriber)

			set.add('value')

			expect(subscriber).toBeCalledTimes(1)
			expect(subscriber).toBeCalledWith('add', ['value'])
		})

		it('should not double subscribe', () => {
			const subscriber = jest.fn()
			const set = new ObservableSet<string>()
			set.subscribe(subscriber)
			set.subscribe(subscriber)

			set.add('value')

			expect(subscriber).toBeCalledTimes(1)
			expect(subscriber).toBeCalledWith('add', ['value'])
		})

		it('should not report existing values', () => {
			const subscriber = jest.fn()
			const set = new ObservableSet<string>()
			set.subscribe(subscriber)

			set.add('value')
			set.add('value')

			expect(subscriber).toBeCalledTimes(1)
			expect(subscriber).toBeCalledWith('add', ['value'])
		})

		it('should publish deleted values', () => {
			const set = new ObservableSet<string>()

			set.add('value')

			const subscriber = jest.fn()
			set.subscribe(subscriber)

			set.delete('value')

			expect(subscriber).toBeCalledTimes(1)
			expect(subscriber).toBeCalledWith('remove', ['value'])
		})

		it('should publish cleared values', () => {
			const set = new ObservableSet<string>()

			set.add('value')
			set.add('value2')

			const subscriber = jest.fn()
			set.subscribe(subscriber)

			set.clear()

			expect(subscriber).toBeCalledTimes(1)
			expect(subscriber).toBeCalledWith('remove', ['value', 'value2'])
		})

		it('should publish nothing on empty clear', () => {
			const set = new ObservableSet<string>()

			const subscriber = jest.fn()
			set.subscribe(subscriber)

			set.clear()

			expect(subscriber).toBeCalledTimes(0)
		})

		it('should allow unsubscribing', () => {
			const subscriber = jest.fn()
			const set = new ObservableSet<string>()
			set.subscribe(subscriber)
			set.unsubscribe(subscriber)

			set.add('value')

			expect(subscriber).toBeCalledTimes(0)
		})
	})
})

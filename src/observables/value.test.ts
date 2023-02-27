import { ObservableValue } from './value'

describe('value', () => {
	it('should initialize', () => {
		const value = new ObservableValue('value')
		expect(value.get()).toBe('value')
	})

	it('should set', () => {
		const value = new ObservableValue('value')

		value.set('value2')

		expect(value.get()).toBe('value2')
	})

	it('should publish', () => {
		const value = new ObservableValue('value')
		const subscriber = jest.fn()
		value.subscribe(subscriber)

		value.set('value2')

		expect(subscriber).toBeCalledTimes(1)
		expect(subscriber).lastCalledWith('value2')
	})

    it('should publish async', async () => {
		const value = new ObservableValue(Promise.resolve('value'))
		const subscriber = jest.fn()
		value.subscribe(subscriber)
		
		value.set(Promise.resolve('value2'))

		await new Promise(process.nextTick)
		expect(subscriber).toBeCalledTimes(1)
		await expect(subscriber.mock.calls[0][0]).resolves.toBe('value2')
	})

    it('should publish only latest async', async () => {
        let resolver: (value: string) => void
		const value = new ObservableValue(Promise.resolve('value'))
		const subscriber = jest.fn()
		value.subscribe(subscriber)
		
        value.set(new Promise((resolve) => resolver = resolve))
		value.set(Promise.resolve('value2'))

        // new Promise() is synchronous so this is always defined
        // @ts-ignore
        resolver('value3')

		await new Promise(process.nextTick)
		expect(subscriber).toBeCalledTimes(1)
		await expect(subscriber.mock.calls[0][0]).resolves.toBe('value2')
	})

	it('should not double subscribe', () => {
		const value = new ObservableValue('value')
		const subscriber = jest.fn()
		value.subscribe(subscriber)
		value.subscribe(subscriber)

		value.set('value2')

		expect(subscriber).toBeCalledTimes(1)
		expect(subscriber).lastCalledWith('value2')
	})

	it('should not publish non-updates', () => {
		const value = new ObservableValue('value')
		const subscriber = jest.fn()
		value.subscribe(subscriber)

		value.set('value')

		expect(subscriber).toBeCalledTimes(0)
	})

	it('should not publish non-updates async', () => {
		const value = new ObservableValue(Promise.resolve('value'))
		const subscriber = jest.fn()
		value.subscribe(subscriber)

		value.set(Promise.resolve('value2'))

		expect(subscriber).toBeCalledTimes(0)
	})

	it('should allow unsubscribing', () => {
		const value = new ObservableValue('value')
		const subscriber = jest.fn()
		value.subscribe(subscriber)
		value.unsubscribe(subscriber)

		value.set('value2')

		expect(subscriber).toBeCalledTimes(0)
	})
})

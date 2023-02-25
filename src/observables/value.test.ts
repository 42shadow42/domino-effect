import { ObservableValue } from "./value"

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

    it('should allow unsubscribing', () => {
        const value = new ObservableValue('value')
        const subscriber = jest.fn()
        value.subscribe(subscriber)
        value.unsubscribe(subscriber)

        value.set('value2')

        expect(subscriber).toBeCalledTimes(0)
    })
})
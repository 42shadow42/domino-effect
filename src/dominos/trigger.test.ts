import { Store } from "./store"
import { trigger } from "./trigger"

describe('trigger', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should create with default value', () => {
        const store = new Store()

        const sut = trigger(() => 'test')

        expect(sut(store).get()).toBe('test')
    })

    it('should create on set', () => {
        const store = new Store()

        const sut = trigger(() => 'test')
        sut(store).set('test2')

        expect(sut(store).get()).toBe('test2')
    })

    it('should update on set', () => {
        const store = new Store()
        
        const sut = trigger(() => 'test')
        sut(store).get()
        sut(store).set('test2')

        expect(sut(store).get()).toBe('test2')
    })

    it('should delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const sut = trigger(() => 'test')
        sut(store).get()
        const isDeleted = sut(store).delete()

        expect(isDeleted).toBe(true)
        expect(store.delete).toBeCalledTimes(1)
    })

    it('should notify subscribers', () => {
        const store = new Store()
        const subscription = jest.fn()
        
        const sut = trigger(() => 'test')
        sut(store).subscribe(subscription)
        sut(store).set('test2')

        expect(subscription).toBeCalledTimes(1)
        expect(subscription).toBeCalledWith('test2')
    })

    it('should allow unsubscribing', () => {
        const store = new Store()
        const subscription = jest.fn()

        const sut = trigger(() => 'test')
        sut(store).subscribe(subscription)
        sut(store).unsubscribe(subscription)
        sut(store).set('test2')

        expect(subscription).toBeCalledTimes(0)
    })

    it('should retain on undefined ttl', () => {
        const store = new Store()
        const subscription = jest.fn()
        let triggerCount = 0
        store.subscribe((action, values) => { action === 'add' ? triggerCount += values.length : triggerCount -= values.length })

        const sut = trigger(() => 'test')
        sut(store).subscribe(subscription)

        expect(triggerCount).toBe(1)

        sut(store).unsubscribe(subscription)

        jest.runAllTimers()

        expect(triggerCount).toBe(1)
    })

    it('should retain until ttl', () => {
        const store = new Store()
        const subscription = jest.fn()
        let triggerCount = 0
        store.subscribe((action, values) => { action === 'add' ? triggerCount += values.length : triggerCount -= values.length })

        const sut = trigger(() => 'test', { ttl: 1000 })
        sut(store).subscribe(subscription)

        expect(triggerCount).toBe(1)

        sut(store).unsubscribe(subscription)

        jest.advanceTimersByTime(999)

        expect(triggerCount).toBe(1)

        jest.advanceTimersByTime(1)
        
        expect(triggerCount).toBe(0)
    })

    it('should not destory while subscribed', () => {
        const store = new Store()
        const subscription = jest.fn()
        let triggerCount = 0
        store.subscribe((action, values) => { action === 'add' ? triggerCount += values.length : triggerCount -= values.length })

        const sut = trigger(() => 'test', { ttl: 1000 })
        sut(store).subscribe(subscription)

        expect(triggerCount).toBe(1)

        sut(store).unsubscribe(subscription)
        sut(store).subscribe(subscription)

        jest.runAllTimers()
        
        expect(triggerCount).toBe(1)
    })

    it('should not crash on unsubscribing when deleted', () => {
        const store = new Store()
        const subscription = jest.fn()

        const sut = trigger(() => 'test')
        sut(store).subscribe(subscription)
        sut(store).delete()
        sut(store).unsubscribe(subscription)
    })
})
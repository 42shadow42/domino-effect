import { ObservableCache } from "../observables"
import { Store } from "../store"
import { domino } from "./domino"
import { trigger } from "./trigger"

describe('domino', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should allow get', () => {
        const store = new Store()

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })

        expect(sut(store).get()).toBe('test')
    })

    it('should allow manage', () => {
        const store = new Store()
        const root = trigger(() => 'test')
        const sut = domino(({ manage }) => {
            return manage(root)
        })

        expect(sut(store).get().value).toBe('test')
        sut(store).get().set('test2')
        expect(sut(store).get().value).toBe('test2')
    })

    // Note: This test case is contrived for testing purposes.
    // However, it is a black box way of validating cache functionality.
    it('should allow caching', () => {
        const store = new Store()

        const root = trigger(() => 'test')
        const sut = domino(({ get, cache }) => {
            if (cache.get(root)) {
                return cache.get(root)
            }
            const value = get(root)
            cache.set(root, value)
            return value
        })

        expect(sut(store).get()).toBe('test')

        root(store).set('test2')

        jest.runAllTimers()

        // Validate the cache is used over the value
        expect(sut(store).get()).toBe('test')
    })

    // Note: This test case is contrived for testing purposes.
    // However, it is a black box way of validating cache functionality.
    it('should allow caching up to ttl', () => {
        const store = new Store()

        const root = trigger(() => 'test')
        const sut = domino(({ get, cache }) => {
            if (cache.get(root)) {
                return cache.get(root)
            }
            const value = get(root)
            cache.set(root, value)
            return value
        }, { ttl: 1000 })

        expect(sut(store).get()).toBe('test')
        root(store).set('test2')

        jest.advanceTimersByTime(999)
        
        // Validate the cache is cleared and the value is refreshed
        expect(sut(store).get()).toBe('test')

        // Otherwise the cache will keep it recalculating
        sut(store).delete()
    })

    // Note: This test case is contrived for testing purposes.
    // However, it is a black box way of validating cache functionality.
    it('should allow remove at ttl', () => {
        const store = new Store()

        const root = trigger(() => 'test')
        const sut = domino(({ get, cache }) => {
            if (cache.get(root)) {
                return cache.get(root)
            }
            const value = get(root)
            cache.set(root, value)
            return value
        }, { ttl: 1000 })

        expect(sut(store).get()).toBe('test')
        root(store).set('test2')

        jest.advanceTimersByTime(1000)
        
        // Validate the cache is cleared and the value is refreshed
        expect(sut(store).get()).toBe('test2')

        // Otherwise the cache will keep it recalculating
        sut(store).delete()
    })

    it('should recalculate on cache-expiry', () => {
        const store = new Store()

        const root = trigger(() => 'test')
        const calculation = jest.fn(({ get, cache }) => {
            if (cache.get(root)) {
                return cache.get(root)
            }
            const value = get(root)
            cache.set(root, value)
            return value
        })
        const sut = domino(calculation, { ttl: 1000 })

        sut(store).get()
        
        expect(calculation).toBeCalledTimes(1)

        jest.advanceTimersByTime(999)

        expect(calculation).toBeCalledTimes(1)

        jest.advanceTimersByTime(1)

        expect(calculation).toBeCalledTimes(2)

        // Otherwise the cache will keep it recalculating
        sut(store).delete()
    })

    it('should domino effect', () => {
        const store = new Store()
        
        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        root(store).set('test2')

        expect(sut(store).get()).toBe('test2')
    })

    it('should calculate once', () => {
        const store = new Store()
        const calculate = jest.fn().mockImplementation(({ get }) => {
            return get(root)
        })
        
        const root = trigger(() => 'test')
        const sut = domino(calculate)
        root(store).set('test2')
        sut(store).get()
        sut(store).get()

        expect(calculate).toBeCalledTimes(1)
    })

    it('should delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        root(store).set('test2')
        sut(store).get()
        const isDeleted = sut(store).delete()

        expect(isDeleted).toBe(true)
        expect(store.delete).toBeCalledTimes(1)
    })

    it('should unsubscribe on deletion', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        const rootImpl = root(store)
        rootImpl.set('test2')
        rootImpl.unsubscribe = jest.fn().mockImplementation(rootImpl.unsubscribe)
        sut(store).get()
        sut(store).delete()

        expect(rootImpl.unsubscribe).toBeCalledTimes(1)
    })

    it('should call onDelete handler on deletion', () => {
        const store = new Store()
        const onDelete = jest.fn()
        
        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        }, { onDelete })
        sut(store).get()
        sut(store).delete()

        expect(onDelete).toBeCalledTimes(1)
        expect(onDelete).toBeCalledWith({ cache: expect.any(ObservableCache)})
    })

    it('should not crash on double delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).get()
        sut(store).delete()
        const isDeleted = sut(store).delete()

        expect(isDeleted).toBe(false)
    })

    it('should notify subscribers', () => {
        const store = new Store()
        const subscription = jest.fn()
        
        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        root(store).set('test2')

        expect(subscription).toBeCalledTimes(1)
        expect(subscription).toBeCalledWith('test2')
    })

    it('should not double subscribriptions', () => {
        const store = new Store()
        const subscription = jest.fn()
        
        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        sut(store).subscribe(subscription)
        root(store).set('test2')

        expect(subscription).toBeCalledTimes(1)
        expect(subscription).toBeCalledWith('test2')
    })

    it('should allow unsubscribing', () => {
        const store = new Store()
        const subscription = jest.fn()

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        sut(store).unsubscribe(subscription)
        root(store).set('test2')

        expect(subscription).toBeCalledTimes(0)
    })

    it('should retain on undefined ttl', () => {
        const store = new Store()
        const subscription = jest.fn()
        let dominoCount = 0
        store.subscribe((action, values) => { action === 'add' ? dominoCount += values.length : dominoCount -= values.length })

        const core = trigger(() => 'test')
        const sut = domino(({ get }) => get(core))
        sut(store).subscribe(subscription)

        expect(dominoCount).toBe(2)

        sut(store).unsubscribe(subscription)

        jest.runAllTimers()

        expect(dominoCount).toBe(2)
    })

    it('should retain until ttl', () => {
        const store = new Store()
        const subscription = jest.fn()
        let dominoCount = 0
        store.subscribe((action, values) => { action === 'add' ? dominoCount += values.length : dominoCount -= values.length })

        const core = trigger(() => 'test')
        const sut = domino(({ get }) => get(core), { ttl: 1000 })
        sut(store).subscribe(subscription)

        expect(dominoCount).toBe(2)

        sut(store).unsubscribe(subscription)

        jest.advanceTimersByTime(999)

        expect(dominoCount).toBe(2)

        jest.advanceTimersByTime(1)
        
        expect(dominoCount).toBe(1)
    })

    it('should not destory while subscribed', () => {
        const store = new Store()
        const subscription = jest.fn()
        let triggerCount = 0
        store.subscribe((action, values) => { action === 'add' ? triggerCount += values.length : triggerCount -= values.length })

        const core = trigger(() => 'test')
        const sut = domino(({ get }) => get(core), { ttl: 1000 })
        sut(store).subscribe(subscription)

        expect(triggerCount).toBe(2)

        sut(store).unsubscribe(subscription)
        sut(store).subscribe(subscription)

        jest.runAllTimers()
        
        expect(triggerCount).toBe(2)
    })

    it('should not crash on unsubscribing deleted', () => {
        const store = new Store()
        const subscription = jest.fn()

        const root = trigger(() => 'test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        sut(store).delete()
        sut(store).unsubscribe(subscription)
    })
})
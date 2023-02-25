import { Store } from "../store"
import { domino } from "./domino"
import { trigger } from "./trigger"

describe('domino', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should allow get', () => {
        const store = new Store()

        const root = trigger('test')
        const sut = domino(({ get }) => {
            return get(root)
        })

        expect(sut(store).get()).toBe('test')
    })

    it('should domino effect', () => {
        const store = new Store()
        
        const root = trigger('test')
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
        
        const root = trigger('test')
        const sut = domino(calculate)
        root(store).set('test2')
        sut(store).get()
        sut(store).get()

        expect(calculate).toBeCalledTimes(1)
    })

    it('should delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const root = trigger('test')
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

        const root = trigger('test')
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

    it('should not crash on double delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const root = trigger('test')
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
        
        const root = trigger('test')
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
        
        const root = trigger('test')
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

        const root = trigger('test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        sut(store).unsubscribe(subscription)
        root(store).set('test2')

        expect(subscription).toBeCalledTimes(0)
    })

    it('should not crash on unsubscribing deleted', () => {
        const store = new Store()
        const subscription = jest.fn()

        const root = trigger('test')
        const sut = domino(({ get }) => {
            return get(root)
        })
        sut(store).subscribe(subscription)
        sut(store).delete()
        sut(store).unsubscribe(subscription)
    })
})
import { Store } from "../store"
import { trigger } from "./trigger"

describe('trigger', () => {
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

    it('should not crash on double delete', () => {
        const store = new Store()
        store.delete = jest.fn().mockImplementation(store.delete)

        const sut = trigger(() => 'test')
        sut(store).get()
        sut(store).delete()
        const isDeleted = sut(store).delete()

        expect(isDeleted).toBe(false)
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

    it('should not crash on unsubscribing when deleted', () => {
        const store = new Store()
        const subscription = jest.fn()

        const sut = trigger(() => 'test')
        sut(store).subscribe(subscription)
        sut(store).delete()
        sut(store).unsubscribe(subscription)
    })
})
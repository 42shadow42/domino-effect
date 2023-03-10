import { createStore, deleteStore, STORES } from './stores'

describe('STORES', () => {
    it('should create the default store', () => {
        expect(STORES.size).toBe(1)
    })

    it('should allow creating and deleting stores', () => {
        const [, symbol] = createStore('Other')
        
        expect(STORES.size).toBe(2)

        deleteStore(symbol)

        expect(STORES.size).toBe(1)
    })

    it('should allow accessing stores by symbol', () => {
        const [store, symbol] = createStore('Other')

        expect(STORES.get(symbol)).toBe(store)

        deleteStore(symbol)
    })
})
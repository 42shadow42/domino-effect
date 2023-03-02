import { List, Map } from 'immutable'
import { ObservableCache } from "./cache"

describe('cache', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })

    describe('should act like map', () => {
        it('should initialize', () => {
            const cache = new ObservableCache(0, [['key', 'value']])
            
            expect(cache.has('key')).toBe(true)
            expect(cache.get('key')).toBe('value')
        })

        it('should retrieve stored values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
    
            expect(cache.get('key')).toBe('value')
        })
    
        it('should know stored values presence', () => {
            const cache = new ObservableCache<string, string>(0)
    
            expect(cache.has('key')).toBe(false)
            
            cache.set('key', 'value')
    
            expect(cache.has('key')).toBe(true)
        })
    
        it('should overwrite values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key', 'value2')
    
            expect(cache.get('key')).toBe('value2')
        })
    
        it('should delete values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.delete('key')
    
            expect(cache.has('key')).toBe(false)
            expect(cache.get('key')).toBe(undefined)
        })

        it('should not crash on delete missing value', () => {
            const cache = new ObservableCache<string, string>(0)
    
            cache.delete('key')
        })
        
        it('should clear values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key2', 'value')
            cache.clear()
    
            expect(cache.has('key')).toBe(false)
            expect(cache.get('key')).toBe(undefined)
            expect(cache.has('key2')).toBe(false)
            expect(cache.get('key2')).toBe(undefined)
        })

        it('should not crash on clear empty cache', () => {
            const cache = new ObservableCache<string, string>(0)
            cache.clear()
        })
    
        it('should track size', () => {
            const cache = new ObservableCache<string, string>(0)
    
            expect(cache.size).toBe(0)
            
            cache.set('key', 'value')
    
            expect(cache.size).toBe(1)
            
            cache.set('key2', 'value')
    
            expect(cache.size).toBe(2)
    
            cache.delete('key')
    
            expect(cache.size).toBe(1)
    
            cache.delete('key2')
    
            expect(cache.size).toBe(0)
        })

        it('should iterate entries', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key2', 'value2')
            const entries = cache.entries()
            expect(entries.next()).toStrictEqual({ done: false, value: ['key', 'value']})
            expect(entries.next()).toStrictEqual({ done: false, value: ['key2', 'value2']})
            expect(entries.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should iterate keys', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key2', 'value2')
            const keys = cache.keys()
            expect(keys.next()).toStrictEqual({ done: false, value: 'key' })
            expect(keys.next()).toStrictEqual({ done: false, value: 'key2' })
            expect(keys.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should iterate values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key2', 'value2')
            const values = cache.values()
            expect(values.next()).toStrictEqual({ done: false, value: 'value' })
            expect(values.next()).toStrictEqual({ done: false, value: 'value2' })
            expect(values.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should forEach', () => {
            const cache = new ObservableCache<string, string>(0)
            const tracker = jest.fn()
            
            cache.set('key', 'value')
            cache.set('key2', 'value2')
            cache.forEach(tracker)

            expect(tracker).toBeCalledTimes(2)
            expect(tracker).toBeCalledWith('value', 'key', expect.any(Map))
            expect(tracker).toBeCalledWith('value2', 'key2', expect.any(Map))
        })
    })

    describe('should be observable', () => {
        it('should publish stored values', () => {
            const subscriber = jest.fn()
            const cache = new ObservableCache<string, string>(0)
            cache.subscribe(subscriber)
            
            cache.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value']], false)
        })

        it('should not double subscribe', () => {
            const subscriber = jest.fn()
            const cache = new ObservableCache<string, string>(0)
            cache.subscribe(subscriber)
            cache.subscribe(subscriber)
            
            cache.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value']], false)
        })

        it('should publish changed stored values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')

            const subscriber = jest.fn()
            cache.subscribe(subscriber)

            cache.set('key', 'value2')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value2']], false)
        })

        it('should not publish identical stored values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')

            const subscriber = jest.fn()
            cache.subscribe(subscriber)

            cache.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(0)
        })

        it('should publish deleted values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')

            const subscriber = jest.fn()
            cache.subscribe(subscriber)

            cache.delete('key')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value']], false)
        })

        it('should publish cleared values', () => {
            const cache = new ObservableCache<string, string>(0)
            
            cache.set('key', 'value')
            cache.set('key2', 'value2')

            const subscriber = jest.fn()
            cache.subscribe(subscriber)

            cache.clear()
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value'], ['key2', 'value2']], false)
        })

        it('should publish nothing on empty clear', () => {
            const cache = new ObservableCache<string, string>(0)

            const subscriber = jest.fn()
            cache.subscribe(subscriber)

            cache.clear()
    
            expect(subscriber).toBeCalledTimes(0)
        })

        it('should allow unsubscribing', () => {
            const subscriber = jest.fn()
            const cache = new ObservableCache<string, string>(0)
            cache.subscribe(subscriber)
            cache.unsubscribe(subscriber)
            
            cache.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(0)
        })
    })

    describe('should act like cache', () => {
        it('should keep items during retention window', () => {
            const cache = new ObservableCache(1000, [['key', 'value']])

            jest.advanceTimersByTime(999)
            expect(cache.has('key')).toBe(true)
            expect(cache.get('key')).toBe('value')
        })

        it('should clear items after retention window', () => {
            const cache = new ObservableCache(1000, [['key', 'value']])

            jest.advanceTimersByTime(1000)
            expect(cache.has('key')).toBe(false)
        })

        it('should fire events on ttl', () => {
            const subscriber = jest.fn()
            const cache = new ObservableCache<string, string>(1000)
           
            cache.set('key', 'value')
            cache.subscribe(subscriber)

            jest.advanceTimersByTime(1000)
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value']], true)
        })

        it('should fire events on initial ttl', () => {
            const subscriber = jest.fn()
            const cache = new ObservableCache<string, string>(1000, [['key', 'value']])
           
            cache.subscribe(subscriber)

            jest.advanceTimersByTime(1000)
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value']], true)
        })
    })
})
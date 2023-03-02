import { Map } from "immutable"
import { ObservableMap } from "./map"

describe('map', () => {
    describe('should act like map', () => {
        it('should initialize', () => {
            const map = new ObservableMap([['key', 'value']])
            
            expect(map.has('key')).toBe(true)
            expect(map.get('key')).toBe('value')
        })

        it('should retrieve stored values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
    
            expect(map.get('key')).toBe('value')
        })
    
        it('should know stored values presence', () => {
            const map = new ObservableMap<string, string>()
    
            expect(map.has('key')).toBe(false)
            
            map.set('key', 'value')
    
            expect(map.has('key')).toBe(true)
        })
    
        it('should overwrite values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key', 'value2')
    
            expect(map.get('key')).toBe('value2')
        })
    
        it('should delete values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.delete('key')
    
            expect(map.has('key')).toBe(false)
            expect(map.get('key')).toBe(undefined)
        })

        it('should not crash on delete missing value', () => {
            const map = new ObservableMap<string, string>()
    
            map.delete('key')
        })
        
        it('should clear values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key2', 'value')
            map.clear()
    
            expect(map.has('key')).toBe(false)
            expect(map.get('key')).toBe(undefined)
            expect(map.has('key2')).toBe(false)
            expect(map.get('key2')).toBe(undefined)
        })

        it('should not crash on clear empty map', () => {
            const map = new ObservableMap<string, string>()
            map.clear()
        })
    
        it('should track size', () => {
            const map = new ObservableMap<string, string>()
    
            expect(map.size).toBe(0)
            
            map.set('key', 'value')
    
            expect(map.size).toBe(1)
            
            map.set('key2', 'value')
    
            expect(map.size).toBe(2)
    
            map.delete('key')
    
            expect(map.size).toBe(1)
    
            map.delete('key2')
    
            expect(map.size).toBe(0)
        })

        it('should iterate entries', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key2', 'value2')
            const entries = map.entries()
            expect(entries.next()).toStrictEqual({ done: false, value: ['key', 'value']})
            expect(entries.next()).toStrictEqual({ done: false, value: ['key2', 'value2']})
            expect(entries.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should iterate keys', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key2', 'value2')
            const keys = map.keys()
            expect(keys.next()).toStrictEqual({ done: false, value: 'key' })
            expect(keys.next()).toStrictEqual({ done: false, value: 'key2' })
            expect(keys.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should iterate values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key2', 'value2')
            const values = map.values()
            expect(values.next()).toStrictEqual({ done: false, value: 'value' })
            expect(values.next()).toStrictEqual({ done: false, value: 'value2' })
            expect(values.next()).toStrictEqual({ done: true, value: undefined })
        })

        it('should forEach', () => {
            const map = new ObservableMap<string, string>()
            const tracker = jest.fn()
            
            map.set('key', 'value')
            map.set('key2', 'value2')
            map.forEach(tracker)

            expect(tracker).toBeCalledTimes(2)
            expect(tracker).toBeCalledWith('value', 'key', expect.any(Map))
            expect(tracker).toBeCalledWith('value2', 'key2', expect.any(Map))
        })
    })

    describe('should be observable', () => {
        it('should publish stored values', () => {
            const subscriber = jest.fn()
            const map = new ObservableMap<string, string>()
            map.subscribe(subscriber)
            
            map.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value']])
        })

        it('should not double subscribe', () => {
            const subscriber = jest.fn()
            const map = new ObservableMap<string, string>()
            map.subscribe(subscriber)
            map.subscribe(subscriber)
            
            map.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value']])
        })

        it('should publish changed stored values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')

            const subscriber = jest.fn()
            map.subscribe(subscriber)

            map.set('key', 'value2')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('add', [['key', 'value2']])
        })

        it('should not publish identical stored values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')

            const subscriber = jest.fn()
            map.subscribe(subscriber)

            map.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(0)
        })

        it('should publish deleted values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')

            const subscriber = jest.fn()
            map.subscribe(subscriber)

            map.delete('key')
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value']])
        })

        it('should publish cleared values', () => {
            const map = new ObservableMap<string, string>()
            
            map.set('key', 'value')
            map.set('key2', 'value2')

            const subscriber = jest.fn()
            map.subscribe(subscriber)

            map.clear()
    
            expect(subscriber).toBeCalledTimes(1)
            expect(subscriber).toBeCalledWith('remove', [['key', 'value'], ['key2', 'value2']])
        })

        it('should publish nothing on empty clear', () => {
            const map = new ObservableMap<string, string>()

            const subscriber = jest.fn()
            map.subscribe(subscriber)

            map.clear()
    
            expect(subscriber).toBeCalledTimes(0)
        })

        it('should allow unsubscribing', () => {
            const subscriber = jest.fn()
            const map = new ObservableMap<string, string>()
            map.subscribe(subscriber)
            map.unsubscribe(subscriber)
            
            map.set('key', 'value')
    
            expect(subscriber).toBeCalledTimes(0)
        })
    })
})
import { Map } from 'immutable'

export type ObservableCacheAction = 'add' | 'remove'
export type ObservableCacheActionData<TKey, TValue> = [TKey, TValue][]
export type ObservableCacheSubscriber<TKey, TValue> = (action: ObservableCacheAction, values: ObservableCacheActionData<TKey, TValue>, expired: boolean) => void
export type ObservableCacheIterationCallback<TKey, TValue> = (value: TValue, key: TKey, map: Map<TKey, TValue>) => void

export class ObservableCache<TKey, TValue> {
    private _map = Map<TKey, TValue>() 
    private _timeouts = Map<TKey, NodeJS.Timeout>()
    private _subscribers = new Set<ObservableCacheSubscriber<TKey, TValue>>()
    private _ttl: number;

    constructor(ttl: number, iterable?: Iterable<[TKey, TValue]>) {
        this._ttl = ttl
        this._map = Map<TKey, TValue>(iterable)
        if (ttl > 0) {
            this._timeouts = Map<TKey, NodeJS.Timeout>([...(iterable || [])].map(([key]) => [key, setTimeout(() => {
                this.delete(key, true)
            }, ttl)]))
        }
    }

    subscribe(subscriber: ObservableCacheSubscriber<TKey, TValue>) {
        this._subscribers.add(subscriber)
    }

    unsubscribe(subscriber: ObservableCacheSubscriber<TKey, TValue>) {
        this._subscribers.delete(subscriber)
    }

    clear() {
        if (this._map.size === 0) {
            return
        }

        const map = this._map
        this._map = map.clear()
        new Set(this._subscribers).forEach((subscriber) => {
            subscriber('remove', [...map.entries()], false)
        })
    }

    delete(key: TKey, expired: boolean = false) {
        const value = this._map.get(key)
		const newMap = this._map.delete(key)
		const removed = this._map.size !== newMap.size
		this._map = newMap

        if (removed) {
            clearTimeout(this._timeouts.get(key))
            new Set(this._subscribers).forEach((subscriber) => {
                subscriber('remove', [[key, value!]], expired)
            })
        }
        return removed
    }

    set(key: TKey, value: TValue) {
        if (this._ttl > 0) {
            clearTimeout(this._timeouts.get(key))
            this._timeouts.set(key, setTimeout(() => {
                this.delete(key, true)
            }, this._ttl))
        }

		if (this._map.get(key) === value) {
			return
		}

		this._map = this._map.set(key, value)
        new Set(this._subscribers).forEach((subscriber) => {
            subscriber('add', [[key, value]], false)
        })
    }

    entries() { return this._map.entries() }
    forEach(callback: ObservableCacheIterationCallback<TKey, TValue>) { this._map.forEach(callback) }
    get(key: TKey) { return this._map.get(key) }
    has(key: TKey) { return this._map.has(key) }
    keys() { return this._map.keys() }
    values() { return this._map.values() }

    get size() {
        return this._map.size
    }
}
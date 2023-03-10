import { Map } from 'immutable'
export type ObservableMapAction = 'add' | 'remove'
export type ObservableMapActionData<TKey, TValue> = [TKey, TValue][]
export type ObservableMapSubscriber<TKey, TValue> = (
	action: ObservableMapAction,
	values: ObservableMapActionData<TKey, TValue>,
) => void
export type ObservableMapIterationCallback<TKey, TValue> = (
	value: TValue,
	key: TKey,
) => void

export class ObservableMap<TKey, TValue> {
	private _map = Map<TKey, TValue>()
	private _subscribers = new Set<ObservableMapSubscriber<TKey, TValue>>()

	constructor(iterable?: Iterable<[TKey, TValue]>) {
		this._map = Map<TKey, TValue>(iterable)
	}

	subscribe(subscriber: ObservableMapSubscriber<TKey, TValue>) {
		this._subscribers.add(subscriber)
	}

	unsubscribe(subscriber: ObservableMapSubscriber<TKey, TValue>) {
		this._subscribers.delete(subscriber)
	}

	clear() {
		if (this._map.size === 0) {
			return
		}

		const map = this._map
		this._map = this._map.clear()
		new Set(this._subscribers).forEach((subscriber) => {
			subscriber('remove', [...map.entries()])
		})
	}

	delete(key: TKey) {
		const value = this._map.get(key)
		const newMap = this._map.delete(key)
		const removed = this._map.size !== newMap.size
		this._map = newMap

		if (removed) {
			new Set(this._subscribers).forEach((subscriber) => {
				subscriber('remove', [[key, value!]])
			})
		}
		return removed
	}

	set(key: TKey, value: TValue) {
		if (this._map.get(key) === value) {
			return
		}

		this._map = this._map.set(key, value)
		new Set(this._subscribers).forEach((subscriber) => {
			subscriber('add', [[key, value]])
		})
	}

	entries() {
		return this._map.entries()
	}
	forEach(callback: ObservableMapIterationCallback<TKey, TValue>) {
		this._map.forEach(callback)
	}
	get(key: TKey) {
		return this._map.get(key)
	}
	has(key: TKey) {
		return this._map.has(key)
	}
	keys() {
		return this._map.keys()
	}
	values() {
		return this._map.values()
	}

	get size() {
		return this._map.size
	}
}

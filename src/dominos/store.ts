import { Context, DominoUtils, TriggerDominoUtils } from './types'
import { ObservableValue } from '../observables'

export type StoreKey = [symbol, Context]
export type StoredDomino = [
	DominoUtils<any, any> | TriggerDominoUtils<any, any>,
	ObservableValue<any>,
]

export type StoreAction = 'add' | 'remove'
export type StoreActionData = [StoreKey, StoredDomino][]
export type StoreSubscriber = (
	action: StoreAction,
	values: StoreActionData,
) => void
export type StoreIterationCallback = (
	value: StoredDomino,
	key: StoreKey,
) => void

export class Store {
	private _map = new Map<symbol, Map<Context, StoredDomino>>()
	private _subscribers = new Set<StoreSubscriber>()
	private _size = 0

	subscribe(subscriber: StoreSubscriber) {
		this._subscribers.add(subscriber)
	}

	unsubscribe(subscriber: StoreSubscriber) {
		this._subscribers.delete(subscriber)
	}

	delete(key: StoreKey) {
		if (!this._map.has(key[0])) return false
		const domino = this._map.get(key[0])!
		if (!domino.has(key[1])) return false
		const contextualDomino = domino.get(key[1])!

		domino.delete(key[1])
		if (domino.size === 0) this._map.delete(key[0])
		this._size = this._size - 1

		new Set(this._subscribers).forEach((subscriber) => {
			subscriber('remove', [[key, contextualDomino]])
		})

		return true
	}

	set(key: StoreKey, value: StoredDomino) {
		if (!this._map.has(key[0])) {
			this._map.set(key[0], new Map<Context, StoredDomino>())
		}
		const domino = this._map.get(key[0])!

		if (domino.has(key[1])) {
			throw new Error(
				`Store already has domino with symbol ${key[0].description} and context ${key[1]}`,
			)
		}

		domino.set(key[1], value)
		this._size = this._size + 1

		new Set(this._subscribers).forEach((subscriber) => {
			subscriber('add', [[key, value]])
		})
	}

	*entries() {
		const dominos = this._map.entries()
		for (
			let domino = dominos.next();
			!domino.done;
			domino = dominos.next()
		) {
			const contextualDominos = domino.value[1].entries()
			for (
				let contextualDomino = contextualDominos.next();
				!contextualDomino.done;
				contextualDomino = contextualDominos.next()
			) {
				yield [
					[domino.value[0], contextualDomino.value[0]],
					contextualDomino.value[1],
				]
			}
		}
	}

	forEach(callback: StoreIterationCallback) {
		const dominos = this._map.entries()
		for (
			let domino = dominos.next();
			!domino.done;
			domino = dominos.next()
		) {
			const contextualDominos = domino.value[1].entries()
			for (
				let contextualDomino = contextualDominos.next();
				!contextualDomino.done;
				contextualDomino = contextualDominos.next()
			) {
				callback(contextualDomino.value[1], [
					domino.value[0],
					contextualDomino.value[0],
				])
			}
		}
	}

	get(key: StoreKey) {
		if (this._map.has(key[0])) {
			return this._map.get(key[0])!.get(key[1])
		}
	}

	has(key: StoreKey) {
		return this._map.has(key[0]) && this._map.get(key[0])!.has(key[1])
	}

	*keys() {
		const dominos = this._map.entries()
		for (
			let domino = dominos.next();
			!domino.done;
			domino = dominos.next()
		) {
			const contextualKeys = domino.value[1].keys()
			for (
				let contextKey = contextualKeys.next();
				!contextKey.done;
				contextKey = contextualKeys.next()
			) {
				yield [domino.value[0], contextKey.value]
			}
		}
	}

	*values() {
		const dominos = this._map.entries()
		for (
			let domino = dominos.next();
			!domino.done;
			domino = dominos.next()
		) {
			const contextualValues = domino.value[1].values()
			for (
				let contextValue = contextualValues.next();
				!contextValue.done;
				contextValue = contextualValues.next()
			) {
				yield contextValue.value
			}
		}
	}

	get size() {
		return this._size
	}
}

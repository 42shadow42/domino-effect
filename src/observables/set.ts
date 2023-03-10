import { Set as ImmutableSet } from 'immutable'

export type ObservableSetAction = 'add' | 'remove'
export type ObservableSetActionData<TValue> = TValue[]
export type ObservableSetSubscriber<TValue> = (action: ObservableSetAction, values: ObservableSetActionData<TValue>) => void
export type ObservableSetIterationCallback<TValue> = (value: TValue, value2: TValue) => void

export class ObservableSet<TValue> {
    private _set = ImmutableSet<TValue>() 
    private _subscribers = new Set<ObservableSetSubscriber<TValue>>()

    constructor(iterable?: Iterable<TValue>) {
        this._set = ImmutableSet<TValue>(iterable)
    }

    subscribe = (subscriber: ObservableSetSubscriber<TValue>) => {
        this._subscribers.add(subscriber)
    }

    unsubscribe = (subscriber: ObservableSetSubscriber<TValue>) => {
        this._subscribers.delete(subscriber)
    }

    clear = () => {
        if (this._set.size === 0) {
            return
        }

        const set = this._set
        this._set = set.clear()
        new Set(this._subscribers).forEach((subscriber) => {
            subscriber('remove', [...set.values()])
        })
    }

    delete = (value: TValue) => {
		const newSet = this._set.delete(value)
		const removed = this._set.size !== newSet.size
		this._set = newSet

		if (removed) {
			new Set(this._subscribers).forEach((subscriber) => {
				subscriber('remove', [value])
			})
		}
		return removed
    }

    add = (value: TValue) => {
        if (this._set.has(value)) {
            return
        }
        
        this._set = this._set.add(value)
        new Set(this._subscribers).forEach((subscriber) => {
            subscriber('add', [value])
        })
    }

    entries = () => this._set.entries()
    forEach = (callback: ObservableSetIterationCallback<TValue>) => this._set.forEach(callback)
    has = (key: TValue) => this._set.has(key)
    keys = () => this._set.keys()
    values = () => this._set.values()

    get size() {
        return this._set.size
    }
}
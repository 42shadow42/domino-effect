import isPromise from 'is-promise'
import isEqual from 'lodash.isequal'

export type ObservableValueSubscriber<TValue> = (value: TValue) => void

export class ObservableValue<TValue> {
	private _value: TValue
	private _subscribers = new Set<ObservableValueSubscriber<TValue>>()
	private _latestPromise: TValue | undefined
	private _latestResolvedValue: any

	constructor(value: TValue) {
		this._value = value
	}

	subscribe = (subscriber: ObservableValueSubscriber<TValue>) => {
		this._subscribers.add(subscriber)
		return this._subscribers.size
	}

	unsubscribe = (subscriber: ObservableValueSubscriber<TValue>) => {
		this._subscribers.delete(subscriber)
		return this._subscribers.size
	}

	get = () => this._value
	set = (value: TValue) => {
		if (this._value === value) {
			return
		}

		if (isPromise(value) && isPromise(this._value)) {
			this._latestPromise = value
			value.then((resolvedValue) => {
				if (
					this._latestPromise === value &&
					!isEqual(this._latestResolvedValue, resolvedValue)
				) {
					this._value = value
					this._latestResolvedValue = resolvedValue
					new Set(this._subscribers).forEach((subscriber) =>
						subscriber(value),
					)
				}
			})
			return
		}

		this._value = value
		new Set(this._subscribers).forEach((subscriber) => subscriber(value))
	}
}

import isPromise from 'is-promise'
import isEqual from 'lodash.isequal'

export type ObservableValueSubscriber<TValue> = (value: TValue) => void

export class ObservableValue<TValue> {
	private _value: TValue
	private _subscribers = new Set<ObservableValueSubscriber<TValue>>()
	private _nextValue: TValue | undefined

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
			this._nextValue = value
			const values = Promise.all([this._value, value])
			values.then(([oldValue, newValue]) => {
				if (this._nextValue === value && !isEqual(oldValue, newValue)) {
					this._value = value
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

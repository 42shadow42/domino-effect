export type ObservableValueSubscriber<TValue> = (value: TValue) => void

export class ObservableValue<TValue> {
    private _value: TValue
    private _subscribers = new Set<ObservableValueSubscriber<TValue>>()

    constructor(value: TValue) {
        this._value = value
    }

    subscribe = (subscriber: ObservableValueSubscriber<TValue>) => {
        this._subscribers.add(subscriber)
    }

    unsubscribe = (subscriber: ObservableValueSubscriber<TValue>) => {
        this._subscribers.delete(subscriber)
    }

    get = () => this._value
    set = (value: TValue) => {
        this._value = value
        new Set(this._subscribers).forEach((subscriber) => subscriber(value))
    }
}
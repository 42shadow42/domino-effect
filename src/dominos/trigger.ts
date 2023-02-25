import { ObservableValue, ObservableValueSubscriber } from "../observables"
import { Store } from "../store"

export type GetDominoValue<TValue> = () => TValue
export type SetDominoValue<TValue> = (value: TValue) => void
export type DeleteDominoValue = () => void
export type SubscribeDominoValue<TValue> = (subscriber: ObservableValueSubscriber<TValue>) => void
export type UnsubscribeDominoValue<TValue> = (subscriber: ObservableValueSubscriber<TValue>) => void

export type DominoUtils<TValue> = {
    get: GetDominoValue<TValue>,
    subscribe: SubscribeDominoValue<TValue>
    unsubscribe: UnsubscribeDominoValue<TValue>
    delete: DeleteDominoValue,
    debugLabel?: string
}

export type TriggerDominoUtils<TValue> = DominoUtils<TValue> & {
    set: SetDominoValue<TValue>
}

export type CoreDomino<TValue> = (store: Store) => DominoUtils<TValue>
export type TriggerDomino<TValue> = (store: Store) => TriggerDominoUtils<TValue>

export type CoreDominoSettings = {
    debugLabel?: string
}

export const trigger = <TValue>(value: TValue, settings: CoreDominoSettings = {}): TriggerDomino<TValue> => {
    const handle = Symbol()

    const { debugLabel } = settings

    const cache = new Map<Store, TriggerDominoUtils<TValue>>()

    return (store: Store) => {
        if (cache.has(store)) {
            return cache.get(store)!
        }

        cache.set(store, {
            get: () => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(value))
                }
                // private handle ensures the type will always be of TValue
                return store.get(handle)!.get()
            },
            set: (value: TValue) => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(value))
                    return
                }
                // private handle ensures the type will always be of TValue
                store.get(handle)!.set(value)
            },
            subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(value))
                }
                store.get(handle)!.subscribe(subscriber)
            },
            unsubscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
                if (!store.has(handle)) {
                    return
                }
                store.get(handle)!.unsubscribe(subscriber)
            },
            delete: () => {
                cache.delete(store)
                return store.delete(handle)
            },
            debugLabel,
        })

        return cache.get(store)!
    }
}
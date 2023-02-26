import { ObservableValue, ObservableValueSubscriber } from "../observables"
import { Store } from "../store"
import { CoreDominoSettings, DominoMetadata, TriggerDomino, TriggerDominoUtils } from "./types"

export const trigger = <TValue>(value: TValue, settings: CoreDominoSettings = {}): TriggerDomino<TValue> => {
    const handle = Symbol()

    const { debugLabel } = settings

    const cache = new Map<Store, TriggerDominoUtils<TValue>>()
    const metadata: DominoMetadata = { type: 'trigger' }

    return Object.assign((store: Store) => {
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
    }, metadata)
}
import { ObservableValue, ObservableValueSubscriber } from "../observables"
import { Store } from "../store"
import { CoreDomino, DominoMetadata, DominoUtils, TriggerDomino } from "./trigger"

export type DominoEffectUtils = {
    get: <TValue>(trigger: TriggerDomino<TValue>) => TValue
}

export type DominoEffectCalculation<TValue> = (utils: DominoEffectUtils) => TValue

export type DominoEffectSettings = {
    debugLabel?: string
}

export const domino = <TValue>(calculation: DominoEffectCalculation<TValue>, settings: DominoEffectSettings = {}): CoreDomino<TValue> => {
    const handle = Symbol()

    const { debugLabel } = settings
    const metadata: DominoMetadata = { type: 'standard' }

    const cache = new Map<Store, DominoUtils<TValue>>()

    return Object.assign((store: Store) => {
        if (cache.has(store)) {
            return cache.get(store)!
        }

        let _dependencies = new Set<TriggerDomino<any>>()

        const subscription = () => {
            _dependencies.forEach((dependency) => dependency(store).unsubscribe(subscription))
            _dependencies = new Set<TriggerDomino<any>>()
            // if (!store.has(handle)) {
            //     store.set(handle, new ObservableValue(calculation(utils)))
            // }
            // // private handle ensures the type will always be of TValue
            // return store.get(handle)!.get()
            store.get(handle)?.set(calculation(utils))
        }

        const utils = {
            get: <TValue>(trigger: TriggerDomino<TValue>) => {
                const domino = trigger(store)
                _dependencies.add(trigger)
                domino.subscribe(subscription)
                return domino.get()
            }
        }

        cache.set(store, {
            subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(calculation(utils)))
                }
                store.get(handle)!.subscribe(subscriber)
            },
            unsubscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
                if (!store.has(handle)) {
                    return
                }
                store.get(handle)!.unsubscribe(subscriber)
            }, 
            get: () => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(calculation(utils)))
                }
                // private handle ensures the type will always be of TValue
                return store.get(handle)!.get()
            },
            delete: () => {
                _dependencies.forEach((dependency) => dependency(store).unsubscribe(subscription))
                _dependencies = new Set<TriggerDomino<any>>()
                cache.delete(store)
                return store.delete(handle)
            },
            debugLabel,
        })
        
        return cache.get(store)!
    }, metadata)
}
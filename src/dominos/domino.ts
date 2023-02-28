import { ObservableCache, ObservableValue, ObservableValueSubscriber } from "../observables"
import { Store } from "../store"
import { CoreDomino, DominoEffectCalculation, DominoEffectSettings, DominoMetadata, DominoUtils, TriggerDomino } from "./types"

export const domino = <TValue>(calculation: DominoEffectCalculation<TValue>, settings: DominoEffectSettings = {}): CoreDomino<TValue> => {
    const handle = Symbol()

    const { debugLabel } = settings
    const metadata: DominoMetadata = { type: 'standard' }

    const dominoCache = new Map<Store, DominoUtils<TValue>>()

    return Object.assign((store: Store) => {
        if (dominoCache.has(store)) {
            return dominoCache.get(store)!
        }

        const cache = new ObservableCache<any, any>(settings.ttl || 0)

        let _dependencies = new Set<CoreDomino<any>>()

        const subscription = () => {
            new Set(_dependencies).forEach((dependency) => dependency(store).unsubscribe(subscription))
            _dependencies = new Set<TriggerDomino<any>>()
            // Users may interact with the cache during calculation so...
            // Don't listen to subscriptions during calculation.
            cache.unsubscribe(subscription)
            store.get(handle)?.set(calculation(utils))
            cache.subscribe(subscription)
        }

        const utils = {
            get: <TValue>(source: CoreDomino<TValue>) => {
                const domino = source(store)
                _dependencies.add(source)
                domino.subscribe(subscription)
                return domino.get()
            },
            manage: <TValue>(trigger: TriggerDomino<TValue>) => {
                const handle = trigger(store)
                _dependencies.add(trigger)
                handle.subscribe(subscription)
                return {
                    value: handle.get(),
                    set: handle.set
                }
            },
            cache,
        }

        dominoCache.set(store, {
            subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
                if (!store.has(handle)) {
                    store.set(handle, new ObservableValue(calculation(utils)))
                    cache.subscribe(subscription)
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
                    cache.subscribe(subscription)
                }
                // private handle ensures the type will always be of TValue
                return store.get(handle)!.get()
            },
            delete: () => {
                new Set(_dependencies).forEach((dependency) => dependency(store).unsubscribe(subscription))
                cache.unsubscribe(subscription)
                dominoCache.delete(store)
                return store.delete(handle)
            },
            debugLabel,
        })
        
        return dominoCache.get(store)!
    }, metadata)
}
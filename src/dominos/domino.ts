import { Map, List, Record } from 'immutable'
import {
	ObservableCache,
	ObservableValue,
	ObservableValueSubscriber,
} from '../observables'
import { Store, StoreKey } from '../store'
import {
	CacheKey,
	Context,
	CoreDomino,
	DominoEffectCalculation,
	DominoEffectSettings,
	DominoMetadata,
	DominoUtils,
	TriggerDomino,
} from './types'

export const domino = <TValue, TContext extends Context>(
	calculation: DominoEffectCalculation<TValue, TContext>,
	settings: DominoEffectSettings = {},
): CoreDomino<TValue, TContext> => {
	const handle = Symbol()

	const { debugLabel, ttl } = settings
	const metadata: DominoMetadata = { type: 'standard' }

	let utilCache =
		Map<Record<CacheKey<TContext>>, DominoUtils<TValue, TContext>>()

	return Object.assign((store: Store, context?: TContext) => {
		const cacheKey = Record({ store, context })()

		if (utilCache.has(cacheKey)) {
			return utilCache.get(cacheKey)!
		}

		const storeKey = Record<StoreKey>({ handle, context })()

		const cache = new ObservableCache<any, any>(settings.ttl || 0)

		let _dependencies = new Set<CoreDomino<any, any>>()

		const subscription = () => {
			new Set(_dependencies).forEach((dependency) =>
				dependency(store).unsubscribe(subscription),
			)
			_dependencies = new Set<TriggerDomino<any, any>>()
			// Users may interact with the cache during calculation so...
			// Don't listen to subscriptions during calculation.
			cache.unsubscribe(subscription)
			store.get(storeKey)?.set(calculation(utils, context))
			cache.subscribe(subscription)
		}

		const utils = {
			get: <TValue, TContext extends Context>(source: CoreDomino<TValue, TContext>) => {
				const domino = source(store)
				_dependencies.add(source)
				domino.subscribe(subscription)
				return domino.get()
			},
			manage: <TValue, TContext extends Context>(
				trigger: TriggerDomino<TValue, TContext>,
				context?: TContext,
			) => {
				const handle = trigger(store, context)
				_dependencies.add(trigger)
				handle.subscribe(subscription)
				return {
					value: handle.get(),
					set: handle.set,
				}
			},
			context,
			cache,
		}

		let gcTimeout: NodeJS.Timeout
		const dominoUtils = {
			subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
				if (!store.has(storeKey)) {
					store.set(
						storeKey,
						new ObservableValue(calculation(utils, context)),
					)
					cache.subscribe(subscription)
				}
				store.get(storeKey)!.subscribe(subscriber)
				clearTimeout(gcTimeout)
			},
			unsubscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
				if (!store.has(storeKey)) {
					return
				}
				const count = store.get(storeKey)!.unsubscribe(subscriber)
				if (count === 0 && ttl !== undefined) {
                    gcTimeout = setTimeout(() => {
                        dominoUtils.delete()
                    }, ttl)
                }
			},
			get: () => {
				if (!store.has(storeKey)) {
					store.set(
						storeKey,
						new ObservableValue(calculation(utils, context)),
					)
					cache.subscribe(subscription)
				}
				// private handle ensures the type will always be of TValue
				return store.get(storeKey)!.get()
			},
			delete: () => {
				new Set(_dependencies).forEach((dependency) =>
					dependency(store).unsubscribe(subscription),
				)
				cache.unsubscribe(subscription)
				cache.delete(store)
				return store.delete(storeKey)
			},
			debugLabel,
		}

		utilCache = utilCache.set(cacheKey, dominoUtils)

		return utilCache.get(cacheKey)!
	}, metadata)
}

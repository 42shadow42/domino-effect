import { Map, List } from 'immutable'
import {
	ObservableCache,
	ObservableValue,
	ObservableValueSubscriber,
} from '../observables'
import { Store } from '../store'
import {
	CoreDomino,
	DominoEffectCalculation,
	DominoEffectSettings,
	DominoMetadata,
	DominoUtils,
	TriggerDomino,
} from './types'

export const domino = <TValue, TContext>(
	calculation: DominoEffectCalculation<TValue, TContext>,
	settings: DominoEffectSettings = {},
): CoreDomino<TValue, TContext> => {
	const handle = Symbol()

	const { debugLabel } = settings
	const metadata: DominoMetadata = { type: 'standard' }

	let utilCache =
		Map<List<Store | TContext | undefined>, DominoUtils<TValue, TContext>>()

	return Object.assign((store: Store, context?: TContext) => {
		const cacheKey = List([store, context])

		if (utilCache.has(cacheKey)) {
			return utilCache.get(cacheKey)!
		}

		const storeKey = List([handle, context])

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
			get: <TValue, TContext>(source: CoreDomino<TValue, TContext>) => {
				const domino = source(store)
				_dependencies.add(source)
				domino.subscribe(subscription)
				return domino.get()
			},
			manage: <TValue, TContext>(
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
			},
			unsubscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
				if (!store.has(storeKey)) {
					return
				}
				store.get(storeKey)!.unsubscribe(subscriber)
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

import { Map, Record } from 'immutable'
import { ObservableValue, ObservableValueSubscriber } from '../observables'
import { Store, StoreKey } from '../store'
import {
	CacheKey,
	Context,
	CoreDominoSettings,
	DominoMetadata,
	TriggerDomino,
	TriggerDominoUtils,
} from './types'

export const trigger = <TValue, TContext extends Context>(
	factory: (context?: TContext) => TValue,
	settings: CoreDominoSettings = {},
): TriggerDomino<TValue, TContext> => {
	const handle = Symbol()

	const { debugLabel, ttl } = settings

	let cache =
		Map<
			Record<CacheKey<TContext>>,
			TriggerDominoUtils<TValue, TContext>
		>()
	const metadata: DominoMetadata = { type: 'trigger' }

	return Object.assign((store: Store, context?: TContext) => {
		const cacheKey = Record({ store, context })()
		if (cache.has(cacheKey)) {
			return cache.get(cacheKey)!
		}
		const storeKey = Record<StoreKey>({ handle, context })()

		let gcTimeout: NodeJS.Timeout
		const utils: TriggerDominoUtils<TValue, TContext> = Object.assign(
			{
				get: () => {
					if (!store.has(storeKey)) {
						store.set(
							storeKey,
							new ObservableValue(factory(context)),
						)
					}
					// private handle ensures the type will always be of TValue
					return store.get(storeKey)!.get()
				},
				set: (value: TValue) => {
					if (!store.has(storeKey)) {
						store.set(storeKey, new ObservableValue(value))
					}
					// private handle ensures the type will always be of TValue
					store.get(storeKey)!.set(value)
				},
				subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
					if (!store.has(storeKey)) {
						store.set(
							storeKey,
							new ObservableValue(factory(context)),
						)
					}
					store.get(storeKey)!.subscribe(subscriber)
					clearTimeout(gcTimeout)
				},
				unsubscribe: (
					subscriber: ObservableValueSubscriber<TValue>,
				) => {
					if (!store.has(storeKey)) {
						return
					}
					const count = store.get(storeKey)!.unsubscribe(subscriber)
					if (count === 0 && ttl !== undefined) {
						gcTimeout = setTimeout(() => {
							utils.delete()
						}, ttl)
					}
				},
				delete: () => {
					const newCache = cache.delete(cacheKey)
					const deleted = newCache.size !== cache.size
					cache = newCache
					return store.delete(storeKey) && deleted
				},
				debugLabel,
			},
			metadata,
		)

		cache = cache.set(cacheKey, utils)

		return cache.get(cacheKey)!
	}, metadata)
}

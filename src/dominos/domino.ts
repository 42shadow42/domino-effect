import {
	ObservableCache,
	ObservableValue,
	ObservableValueSubscriber,
} from '../observables'
import { Store, StoreKey } from './store'
import {
	Context,
	CoreDomino,
	DominoEffectCalculation,
	DominoEffectSettings,
	DominoMetadata,
	TriggerDomino,
} from './types'

export const domino = <TValue, TContext extends Context = undefined>(
	calculation: DominoEffectCalculation<TValue, TContext>,
	settings: DominoEffectSettings = {},
): CoreDomino<TValue, TContext> => {
	const handle = Symbol()

	const { debugLabel, ttl, onDelete } = settings
	const metadata: DominoMetadata = { type: 'standard' }

	return Object.assign((store: Store, context?: TContext) => {
		const storeKey: StoreKey = [handle, context]

		if (store.has(storeKey)) {
			return store.get(storeKey)![0]
		}

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
			store.get(storeKey)?.[1]?.set(calculation(utils, context))
			cache.subscribe(subscription)
		}

		const utils = {
			get: <TValue, TContext extends Context>(
				source: CoreDomino<TValue, TContext>,
				context?: TContext,
			) => {
				const domino = source(store, context) 
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
				store.get(storeKey)![1].subscribe(subscriber)
				clearTimeout(gcTimeout)
			},
			unsubscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
				const count = store.get(storeKey)![1].unsubscribe(subscriber)
				if (count === 0 && ttl !== undefined) {
					gcTimeout = setTimeout(() => {
						dominoUtils.delete()
					}, ttl)
				}
			},
			get: () => {
				return store.get(storeKey)![1].get()
			},
			delete: () => {
				new Set(_dependencies).forEach((dependency) =>
					dependency(store).unsubscribe(subscription),
				)

				onDelete?.({ cache })
				cache.unsubscribe(subscription)
				cache.clear()

				return store.delete(storeKey)
			},
			debugLabel,
		}

		store.set(storeKey, [
			dominoUtils,
			new ObservableValue(calculation(utils, context)),
		])
		cache.subscribe(subscription)

		return store.get(storeKey)![0]
	}, metadata)
}

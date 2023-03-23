import { ObservableValue, ObservableValueSubscriber } from '../observables'
import { Store, StoreKey } from './store'
import {
	Context,
	CoreDominoSettings,
	DominoMetadata,
	TriggerDomino,
	TriggerDominoUtils,
} from './types'

export const trigger = <TValue, TContext extends Context = undefined>(
	factory: (context?: TContext) => TValue,
	settings: CoreDominoSettings = {},
): TriggerDomino<TValue, TContext> => {
	const handle = Symbol()

	const { debugLabel, ttl } = settings
	const metadata: DominoMetadata = { type: 'trigger' }

	return Object.assign((store: Store, context?: TContext) => {
		const storeKey: StoreKey = [handle, context]

		if (store.has(storeKey)) {
			// Because the store key includes the handle we know its a trigger domino
			return store.get(storeKey)![0] as TriggerDominoUtils<TValue>
		}

		let gcTimeout: NodeJS.Timeout
		const utils: TriggerDominoUtils<TValue> = Object.assign(
			{
				get: () => {
					return store.get(storeKey)![1].get()
				},
				set: (value: TValue) => {
					store.get(storeKey)![1].set(value)
				},
				subscribe: (subscriber: ObservableValueSubscriber<TValue>) => {
					store.get(storeKey)![1].subscribe(subscriber)
					clearTimeout(gcTimeout)
				},
				unsubscribe: (
					subscriber: ObservableValueSubscriber<TValue>,
				) => {
					const count = store
						.get(storeKey)![1]
						.unsubscribe(subscriber)
					if (count === 0 && ttl !== undefined) {
						gcTimeout = setTimeout(() => {
							utils.delete()
						}, ttl)
					}
				},
				delete: () => {
					return store.delete(storeKey)
				},
				refresh: () => {
					store.get(storeKey)![1].set(factory(context))
				},
				debugLabel,
			},
			metadata,
		)

		store.set(storeKey, [utils, new ObservableValue(factory(context))])

		// Because the store key includes the handle we know its a trigger domino
		return store.get(storeKey)![0] as TriggerDominoUtils<TValue>
	}, metadata)
}

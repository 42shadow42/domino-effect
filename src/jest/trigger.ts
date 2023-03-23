import { ObservableValueSubscriber } from 'src/observables'
import {
	DominoMetadata,
	Store,
	Context,
	TriggerDomino,
	TriggerDominoUtils,
} from '../dominos'

export type MockTriggerMetadata = {
	delete: jest.Mock
	subscribe: jest.Mock
	unsubscribe: jest.Mock
	get: jest.Mock
	set: jest.Mock
	refresh: jest.Mock
}

export type MockTriggerDomino<TValue, TContext extends Context> = TriggerDomino<
	TValue,
	TContext
> &
	MockTriggerMetadata

export const mockTrigger = <
	TValue,
	TContext extends Context,
>(): MockTriggerDomino<TValue, TContext> => {
	const deleteFn = jest.fn()
	const subscribeFn = jest.fn()
	const unsubscribeFn = jest.fn()
	const getFn = jest.fn()
	const setFn = jest.fn()
	const refreshFn = jest.fn()
	const metadata: DominoMetadata & MockTriggerMetadata = {
		type: 'trigger',
		delete: deleteFn,
		subscribe: subscribeFn,
		unsubscribe: unsubscribeFn,
		get: getFn,
		set: setFn,
		refresh: refreshFn,
	}
	return Object.assign(
		(store: Store, context?: TContext): TriggerDominoUtils<TValue> => {
			return {
				delete: () => deleteFn(store, context),
				subscribe: (callback: ObservableValueSubscriber<TValue>) =>
					subscribeFn(store, context, callback),
				unsubscribe: (callback: ObservableValueSubscriber<TValue>) =>
					unsubscribeFn(store, context, callback),
				get: () => getFn(store, context),
				set: (value: TValue) => setFn(store, context, value),
				refresh: () => refreshFn(store, context),
			}
		},
		metadata,
	)
}

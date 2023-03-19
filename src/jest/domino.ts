import { ObservableValueSubscriber } from '../observables'
import {
	DominoMetadata,
	Store,
	Context,
	CoreDomino,
	DominoUtils,
} from '../dominos'

export type MockDominoMetadata = {
	delete: jest.Mock
	subscribe: jest.Mock
	unsubscribe: jest.Mock
	get: jest.Mock
	refresh: jest.Mock
}

export type MockCoreDomino<TValue, TContext extends Context> = CoreDomino<
	TValue,
	TContext
> &
	MockDominoMetadata

export const mockDomino = <TValue, TContext extends Context>(): MockCoreDomino<
	TValue,
	TContext
> => {
	const deleteFn = jest.fn()
	const subscribeFn = jest.fn()
	const unsubscribeFn = jest.fn()
	const getFn = jest.fn()
	const refreshFn = jest.fn()
	const metadata: DominoMetadata & MockDominoMetadata = {
		type: 'standard',
		delete: deleteFn,
		subscribe: subscribeFn,
		unsubscribe: unsubscribeFn,
		get: getFn,
		refresh: refreshFn,
	}
	return Object.assign(
		(store: Store, context?: TContext): DominoUtils<TValue, TContext> => {
			return {
				delete: () => deleteFn(store, context),
				subscribe: (callback: ObservableValueSubscriber<TValue>) =>
					subscribeFn(store, context, callback),
				unsubscribe: (callback: ObservableValueSubscriber<TValue>) =>
					unsubscribeFn(store, context, callback),
				get: () => getFn(store, context),
				refresh: () => refreshFn(store, context),
			}
		},
		metadata,
	)
}

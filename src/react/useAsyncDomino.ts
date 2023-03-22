// use not yet typed
// @ts-ignore
import { use } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
	CoreDomino,
	TriggerDomino,
	Context,
	isTriggerDomino,
	GLOBAL_STORE,
	Store,
	RefreshDominoValue,
} from '../dominos'
import { ReactSetDominoValue } from './types'

export type useAsyncDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useAsyncDomino<TValue, TContext extends Context>(
	domino: TriggerDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): [TValue, ReactSetDominoValue<Promise<TValue>>, RefreshDominoValue]
export function useAsyncDomino<TValue, TContext extends Context>(
	domino: CoreDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): [TValue, RefreshDominoValue]
export function useAsyncDomino<TValue, TContext extends Context>(
	domino:
		| CoreDomino<Promise<TValue>, TContext>
		| TriggerDomino<Promise<TValue>, TContext>,
	options: useAsyncDominoOptions<TContext> = {},
):
	| [TValue, RefreshDominoValue]
	| [TValue, ReactSetDominoValue<Promise<TValue>>, RefreshDominoValue] {
	const { store = GLOBAL_STORE, context } = options
	const dominoUtils = domino(store, context)
	const [promise, setPromise] = useState(dominoUtils.get())

	const subscriber = useCallback(
		async (promise: Promise<TValue>) => {
			setPromise(promise)
		},
		[setPromise],
	)

	useEffect(() => {
		dominoUtils.subscribe(subscriber)
		return () => dominoUtils.unsubscribe(subscriber)
	}, [dominoUtils])

	const setDominoValue = useCallback(
		(
			value:
				| Promise<TValue>
				| ((value: Promise<TValue>) => Promise<TValue>),
		) => {
			if (isTriggerDomino(domino)) {
				if (value instanceof Function) {
					domino(store, context).set(
						value(domino(store, context).get()),
					)
					return
				}
				domino(store, context).set(value)
			}
		},
		[domino],
	)

	const value = use(promise)
	if (isTriggerDomino(domino)) {
		return [value, setDominoValue, dominoUtils.refresh]
	}

	return [value, dominoUtils.refresh]
}

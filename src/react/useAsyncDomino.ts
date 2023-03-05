import { CoreDomino, TriggerDomino } from '../dominos'
// use not yet typed
// @ts-ignore
import { use } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Context, isTriggerDomino, SetDominoValue } from '../dominos/types'
import { GLOBAL_STORE, Store } from '..'

export type useAsyncDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useAsyncDomino<TValue, TContext extends Context>(
	domino: TriggerDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): [TValue, SetDominoValue<Promise<TValue>>]
export function useAsyncDomino<TValue, TContext extends Context>(
	domino: CoreDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): TValue
export function useAsyncDomino<TValue, TContext extends Context>(
	domino:
		| CoreDomino<Promise<TValue>, TContext>
		| TriggerDomino<Promise<TValue>, TContext>,
	options: useAsyncDominoOptions<TContext> = {},
): TValue | [TValue, SetDominoValue<Promise<TValue>>] {
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
		(value: Promise<TValue>) => {
			if (isTriggerDomino(domino)) {
				domino(store).set(value)
			}
		},
		[domino],
	)

	const value = use(promise)
	if (isTriggerDomino(domino)) {
		return [value, setDominoValue]
	}

	return value
}

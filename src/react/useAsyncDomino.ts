import { CoreDomino, TriggerDomino } from '../dominos'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isTriggerDomino, SetDominoValue } from '../dominos/types'
import { GLOBAL_STORE, Store } from '..'

export type useAsyncDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useAsyncDomino<TValue, TContext>(
	domino: TriggerDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): [TValue, SetDominoValue<Promise<TValue>>]
export function useAsyncDomino<TValue, TContext>(
	domino: CoreDomino<Promise<TValue>, TContext>,
	options?: useAsyncDominoOptions<TContext>,
): TValue
export function useAsyncDomino<TValue, TContext>(
	domino:
		| CoreDomino<Promise<TValue>, TContext>
		| TriggerDomino<Promise<TValue>, TContext>,
	options: useAsyncDominoOptions<TContext> = {},
): TValue | [TValue, SetDominoValue<Promise<TValue>>] {
	const { store = GLOBAL_STORE, context = undefined } = options
	const dominoUtils = domino(store, context)
	const promise = useMemo(() => {
		return dominoUtils.get()
	}, [dominoUtils])
	const promiseRef = useRef<Promise<TValue>>(promise)
	const [value, setValue] = useState<TValue>()
	const [error, setError] = useState<any>()

	const subscriber = useCallback(
		async (promise: Promise<TValue>) => {
			promiseRef.current = promise
			try {
				const value = await promise
				if (promiseRef.current === promise) {
					setValue(value)
				}
			} catch (error) {
				if (promiseRef.current === promise) {
					setError(error)
				}
			}
		},
		[setValue, setError],
	)

	useEffect(() => {
		dominoUtils.subscribe(subscriber)
		return () => dominoUtils.unsubscribe(subscriber)
	}, [dominoUtils, setValue, promiseRef])

	useEffect(() => {
		subscriber(promise)
	}, [dominoUtils])

	const setDominoValue = useCallback(
		(value: Promise<TValue>) => {
			if (isTriggerDomino(domino)) {
				domino(store).set(value)
			}
		},
		[domino],
	)

	if (error !== undefined) {
		throw error
	}

	if (value === undefined) {
		throw promiseRef.current
	}

	if (isTriggerDomino(domino)) {
		return [value, setDominoValue]
	}

	return value
}

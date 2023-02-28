import { CoreDomino, TriggerDomino } from '../dominos'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isTriggerDomino, SetDominoValue } from '../dominos/types'
import { GLOBAL_STORE, Store } from '..'

export function useAsyncDomino<TValue>(
	domino: TriggerDomino<Promise<TValue>>,
	store: Store,
): [TValue, SetDominoValue<Promise<TValue>>]
export function useAsyncDomino<TValue>(
	domino: CoreDomino<Promise<TValue>>,
	store: Store,
): TValue
export function useAsyncDomino<TValue>(
	domino: CoreDomino<Promise<TValue>> | TriggerDomino<Promise<TValue>>,
	store: Store = GLOBAL_STORE,
): TValue | [TValue, SetDominoValue<Promise<TValue>>] {
	const dominoUtils = domino(store)
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

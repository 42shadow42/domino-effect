import { CoreDomino, TriggerDomino } from '../dominos'
import { useCallback, useEffect, useState } from 'react'
import { isTriggerDomino } from '../dominos/types'
import { GLOBAL_STORE, Store } from '..'

export type SetDominoValue<TValue> = (value: TValue) => void

export function useDomino<TValue>(
	domino: TriggerDomino<TValue>,
	store?: Store,
): [TValue, SetDominoValue<TValue>]
export function useDomino<TValue>(
	domino: CoreDomino<TValue>,
	store?: Store,
): TValue
export function useDomino<TValue>(
	domino: CoreDomino<TValue> | TriggerDomino<TValue>,
	store: Store = GLOBAL_STORE,
): TValue | [TValue, SetDominoValue<TValue>] {
	const dominoUtils = domino(store)
	const [value, setValue] = useState(dominoUtils.get())

	useEffect(() => {
		const subscriber = (value: TValue) => setValue(value)
		dominoUtils.subscribe(subscriber)
		return () => dominoUtils.unsubscribe(subscriber)
	}, [dominoUtils, setValue])

	useEffect(() => {
		setValue(dominoUtils.get())
	}, [dominoUtils])

	const setDominoValue = useCallback(
		(value: TValue) => {
			if (isTriggerDomino(domino)) {
				domino(store).set(value)
			}
		},
		[domino],
	)

	if (isTriggerDomino(domino)) {
		return [value, setDominoValue]
	}

	return value
}

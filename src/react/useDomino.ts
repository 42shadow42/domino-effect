import { CoreDomino, TriggerDomino } from '../dominos'
import { useCallback, useEffect, useState } from 'react'
import { isTriggerDomino } from '../dominos/types'
import { GLOBAL_STORE, Store } from '..'

export type SetDominoValue<TValue> = (value: TValue) => void
export type useDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useDomino<TValue, TContext = undefined>(
	domino: TriggerDomino<TValue, TContext>,
	options?: useDominoOptions<TContext>,
): [TValue, SetDominoValue<TValue>]
export function useDomino<TValue, TContext>(
	domino: CoreDomino<TValue, TContext>,
	options?: useDominoOptions<TContext>,
): TValue
export function useDomino<TValue, TContext>(
	domino: CoreDomino<TValue, TContext> | TriggerDomino<TValue, TContext>,
	options: useDominoOptions<TContext> = {},
): TValue | [TValue, SetDominoValue<TValue>] {
	const { store = GLOBAL_STORE, context = undefined } = options
	const dominoUtils = domino(store, context)
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

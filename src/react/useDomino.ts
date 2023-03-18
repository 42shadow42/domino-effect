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

export type useDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useDomino<TValue, TContext extends Context>(
	domino: TriggerDomino<TValue, TContext>,
	options?: useDominoOptions<TContext>,
): [TValue, ReactSetDominoValue<TValue>]
export function useDomino<TValue, TContext extends Context>(
	domino: CoreDomino<TValue, TContext>,
	options?: useDominoOptions<TContext>,
): [TValue, RefreshDominoValue]
export function useDomino<TValue, TContext extends Context>(
	domino: CoreDomino<TValue, TContext> | TriggerDomino<TValue, TContext>,
	options: useDominoOptions<TContext> = {},
): [TValue, RefreshDominoValue] | [TValue, ReactSetDominoValue<TValue>] {
	const { store = GLOBAL_STORE, context } = options
	const dominoUtils = domino(store, context)
	const [value, setValue] = useState(() => dominoUtils.get())

	useEffect(() => {
		const subscriber = (value: TValue) => setValue(value)
		dominoUtils.subscribe(subscriber)
		return () => dominoUtils.unsubscribe(subscriber)
	}, [dominoUtils, setValue])

	useEffect(() => {
		setValue(() => dominoUtils.get())
	}, [dominoUtils])

	const setDominoValue = useCallback(
		(value: TValue | ((value: TValue) => TValue)) => {
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
		[domino, store, context],
	)

	if (isTriggerDomino(domino)) {
		return [value, setDominoValue]
	}

	return [value, dominoUtils.refresh]
}

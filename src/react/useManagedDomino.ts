import {
	CoreDomino,
	TriggerDomino,
	Context,
	GLOBAL_STORE,
	Store,
	TriggerDominoUtils,
	DominoUtils,
} from '../dominos'

export type useManagedDominoOptions<TContext> = {
	store?: Store
	context?: TContext
}

export function useManagedDomino<TValue, TContext extends Context>(
	domino: TriggerDomino<TValue, TContext>,
	options?: useManagedDominoOptions<TContext>,
): TriggerDominoUtils<TValue>
export function useManagedDomino<TValue, TContext extends Context>(
	domino: CoreDomino<TValue, TContext>,
	options?: useManagedDominoOptions<TContext>,
): DominoUtils<TValue>
export function useManagedDomino<TValue, TContext extends Context>(
	domino: CoreDomino<TValue, TContext> | TriggerDomino<TValue, TContext>,
	options: useManagedDominoOptions<TContext> = {},
): TriggerDominoUtils<TValue> | DominoUtils<TValue> {
	const { store = GLOBAL_STORE, context } = options
	return domino(store, context)
}

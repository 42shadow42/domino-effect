import { List, Record, Collection, Map, Set, OrderedMap, OrderedSet, Stack, Seq } from 'immutable'
import { ObservableCache } from 'src/observables/cache'
import { ObservableValueSubscriber } from '../observables'
import { Store } from '../store'

export type Context =
	| List<any>
	| Record<object>
	| Collection<any, any>
	| Map<any, any>
	| Set<any>
	| OrderedMap<any, any>
	| OrderedSet<any>
	| Stack<any>
	| Seq<any, any>
	| string
	| boolean
	| number
	| undefined
export type DominoType = 'standard' | 'trigger'
export type DominoMetadata = { type: DominoType }

export type GetDominoValue<TValue, TContext extends Context> = (context?: TContext) => TValue
export type SetDominoValue<TValue> = (value: TValue) => void
export type DeleteDominoValue = () => void
export type SubscribeDominoValue<TValue> = (
	subscriber: ObservableValueSubscriber<TValue>,
) => void
export type UnsubscribeDominoValue<TValue> = (
	subscriber: ObservableValueSubscriber<TValue>,
) => void

export type DominoUtils<TValue, TContext extends Context> = {
	get: GetDominoValue<TValue, TContext>
	subscribe: SubscribeDominoValue<TValue>
	unsubscribe: UnsubscribeDominoValue<TValue>
	delete: DeleteDominoValue
	debugLabel?: string
}

export type TriggerDominoUtils<TValue, TContext extends Context> = DominoUtils<
	TValue,
	TContext
> & {
	set: SetDominoValue<TValue>
}

export type CoreDomino<TValue, TContext extends Context> = ((
	store: Store,
	context?: TContext,
) => DominoUtils<TValue, TContext>) &
	DominoMetadata
export type TriggerDomino<TValue, TContext extends Context> = ((
	store: Store,
	context?: TContext,
) => TriggerDominoUtils<TValue, TContext>) &
	DominoMetadata

export const isTriggerDomino = <TValue, TContext extends Context>(
	domino: CoreDomino<TValue, TContext> | TriggerDomino<TValue, TContext>,
): domino is TriggerDomino<TValue, TContext> => domino.type === 'trigger'

export type CoreDominoSettings = {
	debugLabel?: string
	ttl?: number
}

export type DominoEffectUtils<TContext extends Context> = {
	get: <TValue, TContext extends Context>(source: CoreDomino<TValue, TContext>, context?: TContext) => TValue
	manage: <TValue, TContext extends Context>(
		trigger: TriggerDomino<TValue, TContext>,
		context?: TContext,
	) => {
		value: TValue
		set: SetDominoValue<TValue>
	},
	context: TContext | undefined
	cache: ObservableCache<any, any>
}

export type DominoDestroyedUtils = {
	cache: ObservableCache<any, any>
}

export type DominoEffectCalculation<TValue, TContext extends Context> = (
	utils: DominoEffectUtils<TContext>,
	context?: TContext,
) => TValue

export type DominoEffectSettings = {
	debugLabel?: string
	ttl?: number
	onDelete?: ({ cache }: DominoDestroyedUtils) => void 
}

export type CacheKey<TContext> = {store: Store, context: TContext | undefined }

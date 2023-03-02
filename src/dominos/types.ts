import { ObservableCache } from 'src/observables/cache'
import { ObservableValueSubscriber } from '../observables'
import { Store } from '../store'

export type DominoType = 'standard' | 'trigger'
export type DominoMetadata = { type: DominoType }

export type GetDominoValue<TValue, TContext> = (context?: TContext) => TValue
export type SetDominoValue<TValue> = (value: TValue) => void
export type DeleteDominoValue = () => void
export type SubscribeDominoValue<TValue> = (
	subscriber: ObservableValueSubscriber<TValue>,
) => void
export type UnsubscribeDominoValue<TValue> = (
	subscriber: ObservableValueSubscriber<TValue>,
) => void

export type DominoUtils<TValue, TContext> = {
	get: GetDominoValue<TValue, TContext>
	subscribe: SubscribeDominoValue<TValue>
	unsubscribe: UnsubscribeDominoValue<TValue>
	delete: DeleteDominoValue
	debugLabel?: string
}

export type TriggerDominoUtils<TValue, TContext> = DominoUtils<
	TValue,
	TContext
> & {
	set: SetDominoValue<TValue>
}

export type CoreDomino<TValue, TContext> = ((
	store: Store,
	context?: TContext,
) => DominoUtils<TValue, TContext>) &
	DominoMetadata
export type TriggerDomino<TValue, TContext> = ((
	store: Store,
	context?: TContext,
) => TriggerDominoUtils<TValue, TContext>) &
	DominoMetadata

export const isTriggerDomino = <TValue, TContext>(
	domino: CoreDomino<TValue, TContext> | TriggerDomino<TValue, TContext>,
): domino is TriggerDomino<TValue, TContext> => domino.type === 'trigger'

export type CoreDominoSettings = {
	debugLabel?: string
	ttl?: number
}

export type DominoEffectUtils<TContext> = {
	get: <TValue, TContext>(source: CoreDomino<TValue, TContext>, context?: TContext) => TValue
	manage: <TValue, TContext>(
		trigger: TriggerDomino<TValue, TContext>,
		context?: TContext,
	) => {
		value: TValue
		set: SetDominoValue<TValue>
	},
	context: TContext | undefined
	cache: ObservableCache<any, any>
}

export type DominoEffectCalculation<TValue, TContext> = (
	utils: DominoEffectUtils<TContext>,
	context?: TContext,
) => TValue

export type DominoEffectSettings = {
	debugLabel?: string
	ttl?: number
}

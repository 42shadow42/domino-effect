import { ObservableValueSubscriber } from "../observables"
import { Store } from "../store"

export type DominoType = 'standard' | 'trigger'
export type DominoMetadata = { type: DominoType }

export type GetDominoValue<TValue> = () => TValue
export type SetDominoValue<TValue> = (value: TValue) => void
export type DeleteDominoValue = () => void
export type SubscribeDominoValue<TValue> = (subscriber: ObservableValueSubscriber<TValue>) => void
export type UnsubscribeDominoValue<TValue> = (subscriber: ObservableValueSubscriber<TValue>) => void

export type DominoUtils<TValue> = {
    get: GetDominoValue<TValue>,
    subscribe: SubscribeDominoValue<TValue>
    unsubscribe: UnsubscribeDominoValue<TValue>
    delete: DeleteDominoValue,
    debugLabel?: string
}

export type TriggerDominoUtils<TValue> = DominoUtils<TValue> & {
    set: SetDominoValue<TValue>
}

export type CoreDomino<TValue> = ((store: Store) => DominoUtils<TValue>) & DominoMetadata
export type TriggerDomino<TValue> = ((store: Store) => TriggerDominoUtils<TValue>) & DominoMetadata

export const isTriggerDomino = <TValue>(domino: CoreDomino<TValue> | TriggerDomino<TValue>): domino is TriggerDomino<TValue> => domino.type === 'trigger'

export type CoreDominoSettings = {
    debugLabel?: string
}

export type DominoEffectUtils = {
    get: <TValue>(source: CoreDomino<TValue>) => TValue
    manage: <TValue>(trigger: TriggerDomino<TValue>) => { value: TValue, set: SetDominoValue<TValue>}
}

export type DominoEffectCalculation<TValue> = (utils: DominoEffectUtils) => TValue

export type DominoEffectSettings = {
    debugLabel?: string
}
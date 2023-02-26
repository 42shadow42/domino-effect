import { CoreDomino, TriggerDomino } from "../dominos";
import { useCallback, useContext, useEffect, useState } from 'react'
import { DominoContext } from "./context";
import { isTriggerDomino } from "../dominos/types";

export type SetDominoValue<TValue> = (value: TValue) => void

export function useDomino<TValue>(domino: TriggerDomino<TValue>): [TValue, SetDominoValue<TValue>]
export function useDomino<TValue>(domino: CoreDomino<TValue>): TValue
export function useDomino<TValue>(domino: CoreDomino<TValue> | TriggerDomino<TValue>): TValue | [TValue, SetDominoValue<TValue>] {
    const store = useContext(DominoContext)
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

    const setDominoValue = useCallback((value: TValue) => {
        if (isTriggerDomino(domino)) {
            domino(store).set(value)
        }
    }, [domino])

    if (isTriggerDomino(domino)) {
        return [value, setDominoValue]
    }

    return value
}
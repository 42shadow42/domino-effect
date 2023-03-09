import { useEffect, useMemo } from "react"
import { createStore, deleteStore } from "../dominos"

export const useLocalStore = (name: string) => {
    const [store, handle] = useMemo(() => createStore(name), [])

    useEffect(() => {
        return () => { deleteStore(handle) }
    }, [])

    return store
}
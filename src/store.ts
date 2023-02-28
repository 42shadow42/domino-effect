import { ObservableMap, ObservableValue } from "./observables";

export class Store extends ObservableMap<symbol, ObservableValue<any>> { }

export const STORES = new ObservableMap<symbol, Store>()
export const GLOBAL_STORE = new Store()

STORES.set(Symbol("Global"), GLOBAL_STORE)

export const createStore = (name: string) => {
    const store = new Store()
    STORES.set(Symbol(name), store)
    return store
}
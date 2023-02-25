import { ObservableMap, ObservableValue } from "./observables";

export class Store extends ObservableMap<symbol, ObservableValue<any>> { }

export const STORES = new ObservableMap<symbol, Store>()
export const DEFAULT_STORE = new Store()

STORES.set(Symbol("Default"), DEFAULT_STORE)
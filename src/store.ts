import { ObservableMap, ObservableValue } from "./observables";

export class Store extends ObservableMap<symbol, ObservableValue<any>> { }

export const STORES = new ObservableMap<symbol, Store>()
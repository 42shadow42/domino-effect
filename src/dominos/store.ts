import { Record } from 'immutable';
import { Context } from './types';
import { ObservableMap, ObservableValue } from '../observables'

export type StoreKey = { handle: symbol; context: Context | undefined }
export class Store extends ObservableMap<Record<StoreKey>, ObservableValue<any>> {}

export const STORES = new ObservableMap<symbol, Store>()
export const GLOBAL_STORE = new Store()

STORES.set(Symbol('Global'), GLOBAL_STORE)

export const createStore = (name: string): [Store, symbol] => {
	const store = new Store()
	const symbol = Symbol(name)
	STORES.set(symbol, store)
	return [store, symbol]
}

export const deleteStore = (handle: symbol) => {
	return STORES.delete(handle)
}

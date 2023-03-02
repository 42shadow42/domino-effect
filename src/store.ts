import { Record } from 'immutable';
import { Context } from './dominos/types';
import { ObservableMap, ObservableValue } from './observables'

export class Store<TContext extends Context> extends ObservableMap<Record<{ handle: symbol; context: TContext | undefined }>, ObservableValue<any>> {}

export const STORES = new ObservableMap<symbol, Store<Context>>()
export const GLOBAL_STORE = new Store()

STORES.set(Symbol('Global'), GLOBAL_STORE)

export const createStore = (name: string): [Store<any>, symbol] => {
	const store = new Store<Context>()
	const symbol = Symbol(name)
	STORES.set(symbol, store)
	return [store, symbol]
}

export const deleteStore = (handle: symbol) => {
	return STORES.delete(handle)
}

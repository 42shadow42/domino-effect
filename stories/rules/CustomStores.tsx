import { createContext, Fragment, useContext } from 'react'
import {
	createStore,
	domino,
	GLOBAL_STORE,
	useLocalStore,
	trigger,
	useDomino,
} from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello')
const derivative = domino(({ get }) => {
	return get(core) + ' world!'
})

const storeContext = createContext(createStore('Custom Store')[0])

export const DefaultStore = () => {
	const value = useDomino(derivative)
	const [coreValue, setCoreValue] = useDomino(core)
	return (
		<Fragment>
			<h4 aria-label="Default Store">{value}</h4>
			<input
				aria-label="Default Store"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
		</Fragment>
	)
}

export const CustomStore = () => {
	const store = useContext(storeContext)
	const value = useDomino(derivative, { store })
	const [coreValue, setCoreValue] = useDomino(core, { store })
	return (
		<Fragment>
			<h4 aria-label="Custom Store">{value}</h4>
			<input
				aria-label="Custom Store"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
		</Fragment>
	)
}

const LocalStoreContext = createContext(GLOBAL_STORE)

export const LocalStore = () => {
	const store = useContext(LocalStoreContext)
	const value = useDomino(derivative, { store })
	const [coreValue, setCoreValue] = useDomino(core, { store })
	return (
		<Fragment>
			<h4 aria-label="Local Store">{value}</h4>
			<input
				aria-label="Local Store"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
		</Fragment>
	)
}

export const CustomStores = () => {
	const store = useLocalStore('Local Store')
	return (
		<Fragment>
			<DefaultStore />
			<CustomStore />
			<LocalStoreContext.Provider value={store}>
				<LocalStore />
			</LocalStoreContext.Provider>
		</Fragment>
	)
}

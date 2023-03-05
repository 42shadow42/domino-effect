import { createContext, Fragment, useContext  } from 'react'
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

const combined = domino(({ get, manage }) => {
	return {
		core: manage(core),
		derivative: get(derivative),
	}
})

const storeContext = createContext(createStore('Custom Store')[0])

export const DefaultStore = () => {
	const value = useDomino(combined)
	return (
		<Fragment>
			<h4 aria-label="Default Store">{value.derivative}</h4>
			<input
				aria-label="Default Store"
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
			/>
		</Fragment>
	)
}

export const CustomStore = () => {
	const store = useContext(storeContext)
	const value = useDomino(combined, { store })
	return (
		<Fragment>
			<h4 aria-label="Custom Store">{value.derivative}</h4>
			<input
				aria-label="Custom Store"
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
			/>
		</Fragment>
	)
}

const LocalStoreContext = createContext(GLOBAL_STORE)

export const LocalStore = () => {
	const store = useContext(LocalStoreContext)
	const value = useDomino(combined, { store })
	return (
		<Fragment>
			<h4 aria-label="Local Store">{value.derivative}</h4>
			<input
				aria-label="Local Store"
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
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

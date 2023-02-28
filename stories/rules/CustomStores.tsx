import { createContext, Fragment, useContext } from 'react'
import {
	createStore,
	domino,
	trigger,
	useDomino,
} from '@42shadow42/domino-effect'

const core = trigger('Hello')
const derivative = domino(({ get }) => {
	return get(core) + ' world!'
})

const combined = domino(({ get, manage }) => {
	return {
		core: manage(core),
		derivative: get(derivative),
	}
})

const storeContext = createContext(createStore('Custom Store'))

export const DefaultStore = () => {
	const value = useDomino(combined)
	return (
		<Fragment>
			<h4>{value.derivative}</h4>
			<input
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
			/>
		</Fragment>
	)
}

export const CustomStore = () => {
	const store = useContext(storeContext)
	const value = useDomino(combined, store)
	return (
		<Fragment>
			<h4>{value.derivative}</h4>
			<input
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
			/>
		</Fragment>
	)
}

export const CustomStoresExample = () => {
	return (
		<Fragment>
			<DefaultStore />
			<CustomStore />
		</Fragment>
	)
}

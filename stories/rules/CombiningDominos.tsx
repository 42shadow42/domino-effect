import { Fragment } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

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

export const CombiningDominos = () => {
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

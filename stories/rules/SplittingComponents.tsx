import { Fragment } from 'react'
import { trigger, domino, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello')
const derivative = domino(({ get }) => {
	return get(core) + ' world!'
})

const Domino = () => {
	const value = useDomino(derivative)
	return <h4 aria-label="Domino">{value}</h4>
}

const Trigger = () => {
	const [value, setValue] = useDomino(core)
	return (
		<Fragment>
			<input
				aria-label="Trigger"
				type="text"
				value={value}
				onChange={(evt) => setValue(evt.target.value)}
			/>
		</Fragment>
	)
}

export const SplittingComponents = () => {
	return (
		<Fragment>
			<Domino />
			<Trigger />
		</Fragment>
	)
}

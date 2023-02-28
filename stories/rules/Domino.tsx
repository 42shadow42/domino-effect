import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger('Hello')
const derivative = domino(({ get }) => {
	return get(core) + ' world!'
})

export const Domino = () => {
	const Domino = () => {
		const value = useDomino(derivative)
		return <h4>{value}</h4>
	}

	return <Domino />
}
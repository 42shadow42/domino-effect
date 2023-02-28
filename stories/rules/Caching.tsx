import { Fragment } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger('Hello')
const cached = domino(({ get, cache }) => {
    const value = get(core)
	if (cache.has(value)) {
		return `${cache.get(value)} - cached`
	}
	cache.set(value, value + ' world!')
	return value + ' world!'
})

const expiring = domino(
	({ get, cache }) => {
        const value = get(core)
        if (cache.has(value)) {
            return `${cache.get(value)} - cached`
        }
        cache.set(value, value + ' world!')
        return value + ' world!'
	},
	{ ttl: 1000 },
)

const combined = domino(({ get, manage }) => {
	return {
		core: manage(core),
		derivative: get(cached),
		expiring: get(expiring),
	}
})

export const Caching = () => {
	const value = useDomino(combined)
	return (
		<Fragment>
			<h4>{value.derivative}</h4>
			<h5>{value.expiring}</h5>
			<input
				type="text"
				value={value.core.value}
				onChange={(evt) => value.core.set(evt.target.value)}
			/>
		</Fragment>
	)
}

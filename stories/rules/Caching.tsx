import { Fragment } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello')
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

export const Caching = () => {
	const [cachedValue] = useDomino(cached)
	const [expiringValue] = useDomino(expiring)
	const [coreValue, setCoreValue] = useDomino(core)
	return (
		<Fragment>
			<h4 aria-label="Cached">{cachedValue}</h4>
			<h5 aria-label="Expiring">{expiringValue}</h5>
			<input
				aria-label="Core"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
		</Fragment>
	)
}

import { Fragment } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello world')

const refreshable = domino(
	({ get, cache }) => {
		const value = get(core)
		if (!cache.has('counter')) {
			cache.set('counter', -1)
		}
		cache.set('counter', cache.get('counter')! + 1)
		return `Value: ${value}! Changed ${cache.get('counter')} times!`
	},
	{
		onDelete: ({ cache }) => {
			// Note: cache.delete('counter') is redundant here because the cache is automatically cleared onDelete.
			// The example here is just for illustration purposes.
			cache.delete('counter')
		},
	},
)

const DisplayValue = () => {
	const [refreshableValue, refresh] = useDomino(refreshable)
	return (
		<Fragment>
			<h4 aria-label="Display Value">{refreshableValue}</h4>
			<button onClick={refresh}>Refresh</button>
		</Fragment>
	)
}

export const Refresh = () => {
	const [coreValue, setCoreValue] = useDomino(core)

	return (
		<Fragment>
			<input
				aria-label="Core"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
			<DisplayValue />
		</Fragment>
	)
}

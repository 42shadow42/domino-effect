import { Fragment, useState } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'
import { action } from '@storybook/addon-actions'

const core = trigger(() => 'Hello world')

const sensitive = domino(
	({ get, cache }) => {
		const value = get(core)
		if (!cache.has('counter')) {
			cache.set('counter', -1)
		}
		cache.set('counter', cache.get('counter')! + 1)
		return `Value: ${value}! Changed ${cache.get('counter')} times!`
	},
	{
		ttl: 0,
		onDelete: ({ cache }) => {
			// Note: cache.delete('counter') is redundant here because the cache is automatically cleared onDelete.
			// The example here is just for illustration purposes.
			cache.delete('counter')
			action('cleanup')()
		},
	},
)

const DisplayValue = () => {
	const [sensitiveValue] = useDomino(sensitive)
	return <h4 aria-label="Display Value">{sensitiveValue}</h4>
}

export const ManualCleanup = () => {
	const [visible, setVisible] = useState(true)
	const buttonText = visible ? 'Hide' : 'Show'
	const [coreValue, setCoreValue] = useDomino(core)

	return (
		<Fragment>
			<input
				aria-label="Core"
				type="text"
				value={coreValue}
				onChange={(evt) => setCoreValue(evt.target.value)}
			/>
			<button onClick={() => setVisible(!visible)}>{buttonText}</button>
			{visible && <DisplayValue />}
		</Fragment>
	)
}

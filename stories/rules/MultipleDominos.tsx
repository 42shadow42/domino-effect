import { Fragment, Suspense } from 'react'
import {
	domino,
	trigger,
	useAsyncDomino,
	useDomino,
} from '@42shadow42/domino-effect'

const core = trigger(() => Promise.resolve('Hello'))
const derivative = domino(async ({ get }) => {
	return (await get(core)) + ' world!'
})

export const AsynchronousComponent = () => {
	const derivativeValue = useAsyncDomino(derivative)
	const [coreValue, setCoreValue] = useAsyncDomino(core)
	return (
		<Fragment>
			<h4 aria-label="Domino">{derivativeValue}</h4>
			<input
				aria-label="Trigger"
				type="text"
				value={coreValue}
				onChange={(evt) =>
					setCoreValue(Promise.resolve(evt.target.value))
				}
			/>
		</Fragment>
	)
}

export const MultipleDominos = () => {
	return (
		<Suspense fallback="loading">
			<AsynchronousComponent />
		</Suspense>
	)
}

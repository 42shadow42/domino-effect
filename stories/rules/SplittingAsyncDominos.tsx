import { Fragment, Suspense } from 'react'
import { action } from '@storybook/addon-actions'
import {
	domino,
	trigger,
	useAsyncDomino,
} from '@42shadow42/domino-effect'

const core = trigger(async () => ({
	greeting: 'Hello',
	target: 'world!',
}))

const manager = domino(async ({ get, manage }) => {
	return {
		values: await get(core),
		manage: manage(core),
	}
})

const splitGreeting = domino(async ({ get }) => {
	const value = await get(core)
	action('split greeting evaulated')(value.greeting)
	return value.greeting
})

const splitTarget = domino(async ({ get }) => {
	const value = await get(core)
	action('split target evaulated')(value.target)
	return value.target
})

const greeting = domino(async ({ get }) => {
	const value = await get(splitGreeting)
	action('greeting evaulated')(value)
	return value
})

const target = domino(async ({ get }) => {
	const value = await get(splitTarget)
	action('target evaulated')(value)
	return value
})

const GreetingDisplay = () => {
	const value = useAsyncDomino(greeting)
	action('greeting rendered')(value)
	return <Fragment>{value}</Fragment>
}

const TargetDisplay = () => {
	const value = useAsyncDomino(target)
	action('target rendered')(value)
	return <Fragment>{value}</Fragment>
}

const Editor = () => {
	const value = useAsyncDomino(manager)
	return (
		<Fragment>
			<input
				aria-label="Greeting"
				type="text"
				value={value.values.greeting}
				onChange={(evt) =>
					value.manage.set(
						Promise.resolve({
							...value.values,
							greeting: evt.target.value,
						}),
					)
				}
			/>
			<input
				aria-label="Target"
				type="text"
				value={value.values.target}
				onChange={(evt) =>
					value.manage.set(
						Promise.resolve({
							...value.values,
							target: evt.target.value,
						}),
					)
				}
			/>
		</Fragment>
	)
}

export const SplittingAsyncDominos = () => {
	return (
		<Fragment>
			<h4 aria-label="Display Value">
				<Suspense fallback="loading">
					<GreetingDisplay />
				</Suspense>{' '}
				<Suspense fallback="loading">
					<TargetDisplay />
				</Suspense>
			</h4>
			<Suspense fallback="loading">
				<Editor />
			</Suspense>
		</Fragment>
	)
}

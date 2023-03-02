import { action } from '@storybook/addon-actions'
import { Fragment, memo } from 'react'
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => ({
	greeting: 'Hello',
	target: 'world!',
}))

const greeting = domino(({ get }) => {
	return get(core).greeting
})

const target = domino(({ get }) => {
	return get(core).target
})

const GreetingDisplay = memo(() => {
	const value = useDomino(greeting)
	action('greeting rendered')(value)
	return <Fragment>{value}</Fragment>
})

const TargetDisplay = memo(() => {
	const value = useDomino(target)
	action('target rendered')(value)
	return <Fragment>{value}</Fragment>
})

export const SplittingDominos = () => {
	const [value, setValue] = useDomino(core)
	return (
		<Fragment>
			<h4>
				<GreetingDisplay /> <TargetDisplay />
			</h4>
			<input
				type="text"
				value={value.greeting}
				onChange={(evt) =>
					setValue({ ...value, greeting: evt.target.value })
				}
			/>
			<input
				type="text"
				value={value.target}
				onChange={(evt) =>
					setValue({ ...value, target: evt.target.value })
				}
			/>
		</Fragment>
	)
}
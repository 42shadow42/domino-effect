import { ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Component, Fragment, memo } from 'react'
import { domino, trigger } from '../dominos'
import { useDomino } from './useDomino'
export const Trigger: ComponentStory<typeof Component> = () => {
	const core = trigger('Hello')

	const Trigger = () => {
		const [value, setValue] = useDomino(core)
		return (
			<input
				type="text"
				value={value}
				onChange={(evt) => setValue(evt.target.value)}
			/>
		)
	}

	return <Trigger />
}

export const Domino: ComponentStory<typeof Component> = () => {
	const core = trigger('Hello')
	const derivative = domino(({ get }) => {
		return get(core) + ' world!'
	})

	const Domino = () => {
		const value = useDomino(derivative)
		return <h4>{value}</h4>
	}

	return <Domino />
}

export const SplittingComponents: ComponentStory<typeof Component> = () => {
	const core = trigger('Hello')
	const derivative = domino(({ get }) => {
		return get(core) + ' world!'
	})

	const Domino = () => {
		const value = useDomino(derivative)
		return <h4>{value}</h4>
	}

	const Trigger = () => {
		const [value, setValue] = useDomino(core)
		return (
			<Fragment>
				<input
					type="text"
					value={value}
					onChange={(evt) => setValue(evt.target.value)}
				/>
			</Fragment>
		)
	}

	const SplittingComponents = () => {
		return (
			<Fragment>
				<Domino />
				<Trigger />
			</Fragment>
		)
	}

	return <SplittingComponents />
}

export const CombiningDominos: ComponentStory<typeof Component> = () => {
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

	const CombiningDominos = () => {
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

	return <CombiningDominos />
}

export const SplittingDominos: ComponentStory<typeof Component> = () => {
	const core = trigger({
		greeting: 'Hello',
		target: 'world!',
	})

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

	const SplittingDominos = () => {
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

	return <SplittingDominos />
}

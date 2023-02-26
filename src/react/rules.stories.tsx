import { ComponentStory } from '@storybook/react'
import { Component, Fragment } from 'react'
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

	return (
		<Fragment>
			<Domino />
			<Trigger />
		</Fragment>
	)
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

	const Combined = () => {
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

	return (
		<Combined />
	)
}

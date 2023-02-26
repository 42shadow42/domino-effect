import { ComponentStory } from '@storybook/react'
import { Component, Fragment } from 'react'
import { domino, trigger } from '../dominos'
import { useDomino } from './useDomino'

export const OneDominoPerComponent: ComponentStory<typeof Component> = () => {
	const core = trigger('Hello')
	const derivative = domino(({ get }) => {
		return get(core) + ' world!'
	})

	const Domino = () => {
		const value = useDomino(derivative)
		return <h1>{value}</h1>
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
		return <h1>{value}</h1>
	}

	return <Domino />
}

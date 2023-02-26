import { ComponentStory } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { Component, Fragment, memo } from 'react'
import { domino, trigger } from '../dominos'
import { useDomino } from './useDomino'
import { useAsyncDomino } from './useAsyncDomino'
import { DominoSuspense } from './suspense'
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

export const SplittingAsyncDominos: ComponentStory<typeof Component> = () => {
	const core = trigger(
		Promise.resolve({
			greeting: 'Hello',
			target: 'world!',
		}),
	)

	const manager = domino(async ({ get, manage }) => {
		return {
			values: await get(core),
			manage: manage(core),
		}
	})

	const greeting = domino(async ({ get }) => {
		return (await get(core)).greeting
	})

	const target = domino(async ({ get }) => {
		return (await get(core)).target
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

	const SplittingDominosAsync = () => {
		return (
			<Fragment>
				<h4>
					<DominoSuspense fallback="loading">
						{GreetingDisplay}
					</DominoSuspense>
					<DominoSuspense fallback="loading">
						{TargetDisplay}
					</DominoSuspense>
				</h4>
				<DominoSuspense fallback="loading">
					{Editor}
				</DominoSuspense>
			</Fragment>
		)
	}

	return <SplittingDominosAsync />
}


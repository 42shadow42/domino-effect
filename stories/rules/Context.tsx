import { Fragment, useState } from 'react'
import { trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger((context: string | undefined) => {
	console.log('initializing')
	return context || 'Hello'
})

export const Context = () => {
	const [context, setContext] = useState('Hello')
	const [contextual, setContextual] = useDomino(core, { context })
	const [nonContextual, setNonContextual] = useDomino(core)
	return (
		<Fragment>
			<h4>Contextual</h4>
			Context:{' '}
			<input
				aria-label="Context"
				type="text"
				value={context}
				onChange={(evt) => setContext(evt.target.value)}
			/>
			Value:{' '}
			<input
				aria-label="Contextual Value"
				type="text"
				value={contextual}
				onChange={(evt) => setContextual(evt.target.value)}
			/>
			<h4>Non contextual</h4>
			Value:{' '}
			<input
				aria-label="Non Contextual Value"
				type="text"
				value={nonContextual}
				onChange={(evt) => setNonContextual(evt.target.value)}
			/>
		</Fragment>
	)
}

import { Fragment, useState } from 'react'
import { domino, DominoEffectUtils, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger((context: string | undefined) => {
    return context || 'Hello'
})

const combined = domino(({ manage, context }: DominoEffectUtils<string>) => {
	return {
		contextual: manage(core, context),
		nonContextual: manage(core),
	}
})

export const Context = () => {
    const [context, setContext] = useState('Hello')
	const dominos = useDomino(combined, { context })
	return (
		<Fragment>
			<h4>Contextual</h4>
            Context: <input aria-label="Context" type="text" value={context} onChange={(evt) => setContext(evt.target.value)} /> 
            Value: <input aria-label="Contextual Value" type="text" value={dominos.contextual.value} onChange={(evt) => dominos.contextual.set(evt.target.value)} />
            <h4>Non contextual</h4>
            Value: <input aria-label="Non Contextual Value" type="text" value={dominos.nonContextual.value} onChange={(evt) => dominos.nonContextual.set(evt.target.value)} />
		</Fragment>
	)
}

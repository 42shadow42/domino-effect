import React from 'react'
import { trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger('Hello')

export const Trigger = () => {

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
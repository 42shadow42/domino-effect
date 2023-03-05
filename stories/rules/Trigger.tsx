import { trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello')

export const Trigger = () => {
	const [value, setValue] = useDomino(core)
	return (
		<input
			aria-label="Trigger"
			type="text"
			value={value}
			onChange={(evt) => setValue(evt.target.value)}
		/>
	)
}

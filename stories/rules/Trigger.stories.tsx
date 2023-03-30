import { Meta, StoryObj } from '@storybook/react'
import { Trigger as TriggerComponent } from './Trigger'
// @ts-ignore
import TriggerSource from './Trigger?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: TriggerComponent,
}

export default meta
type Story = StoryObj<typeof TriggerComponent>

export const Trigger: Story = {
	parameters: {
		docs: {
			source: {
				code: TriggerSource,
				language: 'tsx',
			},
		},
	},
}

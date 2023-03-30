import { Meta, StoryObj } from '@storybook/react'
import { Context as ContextComponent } from './Context'
// @ts-ignore
import ContextSource from './Context?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: ContextComponent,
}

export default meta
type Story = StoryObj<typeof ContextComponent>

export const Context: Story = {
	parameters: {
		docs: {
			source: {
				code: ContextSource,
				language: 'tsx',
			},
		},
	},
}

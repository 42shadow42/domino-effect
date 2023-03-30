import { Meta, StoryObj } from '@storybook/react'
import { Domino as DominoComponent } from './Domino'
// @ts-ignore
import DominoSource from './Domino?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: DominoComponent,
}

export default meta
type Story = StoryObj<typeof DominoComponent>

export const Domino: Story = {
	parameters: {
		docs: {
			source: {
				code: DominoSource,
				language: 'tsx',
			},
		},
	},
}

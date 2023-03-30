import { Meta, StoryObj } from '@storybook/react'
import { Refresh as RefreshComponent } from './Refresh'
// @ts-ignore
import RefreshSource from './Refresh?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: RefreshComponent,
}

export default meta
type Story = StoryObj<typeof RefreshComponent>

export const Refresh: Story = {
	parameters: {
		docs: {
			source: {
				code: RefreshSource,
				language: 'tsx',
			},
		},
	},
}

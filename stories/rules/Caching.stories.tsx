import { Meta, StoryObj } from '@storybook/react'
import { Caching as CachingComponent } from './Caching'
// @ts-ignore
import CachingSource from './Caching?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: CachingComponent,
}

export default meta
type Story = StoryObj<typeof CachingComponent>

export const Caching: Story = {
	parameters: {
		docs: {
			source: {
				code: CachingSource,
				language: 'tsx',
			},
		},
	},
}

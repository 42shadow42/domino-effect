import { Meta, StoryObj } from '@storybook/react'
import { NPMRegistry as NPMRegistryComponent } from './NPMRegistry'
// @ts-ignore
import NPMRegistrySource from './NPMRegistry?raw'

const meta: Meta = {
	title: 'Domino/Examples',
	component: NPMRegistryComponent,
}

export default meta
type Story = StoryObj<typeof NPMRegistryComponent>

export const NPMRegistry: Story = {
	parameters: {
		docs: {
			source: {
				code: NPMRegistrySource,
				language: 'tsx',
			},
		},
	},
}

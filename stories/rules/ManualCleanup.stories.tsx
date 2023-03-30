import { Meta, StoryObj } from '@storybook/react'
import { ManualCleanup as ManualCleanupComponent } from './ManualCleanup'
// @ts-ignore
import ManualCleanupSource from './ManualCleanup?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: ManualCleanupComponent,
}

export default meta
type Story = StoryObj<typeof ManualCleanupComponent>

export const ManualCleanup: Story = {
	parameters: {
		docs: {
			source: {
				code: ManualCleanupSource,
				language: 'tsx',
			},
		},
	},
}

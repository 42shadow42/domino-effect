import { Meta, StoryObj } from '@storybook/react'
import { MultipleDominos as MultipleDominosComponent } from './MultipleDominos'
// @ts-ignore
import MultipleDominosSource from './MultipleDominos?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: MultipleDominosComponent,
}

export default meta
type Story = StoryObj<typeof MultipleDominosComponent>

export const MultipleDominos: Story = {
	parameters: {
		docs: {
			source: {
				code: MultipleDominosSource,
				language: 'tsx',
			},
		},
	},
}

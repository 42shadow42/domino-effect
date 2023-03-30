import { Meta, StoryObj } from '@storybook/react'
import { SplittingDominos as SplittingDominosComponent } from './SplittingDominos'
// @ts-ignore
import SplittingDominosSource from './SplittingDominos?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: SplittingDominosComponent,
}

export default meta
type Story = StoryObj<typeof SplittingDominosComponent>

export const SplittingDominos: Story = {
	parameters: {
		docs: {
			source: {
				code: SplittingDominosSource,
				language: 'tsx',
			},
		},
	},
}

import { Meta, StoryObj } from '@storybook/react'
import { SplittingAsyncDominos as SplittingAsyncDominosComponent } from './SplittingAsyncDominos'
// @ts-ignore
import SplittingAsyncDominosSource from './SplittingAsyncDominos?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: SplittingAsyncDominosComponent,
}

export default meta
type Story = StoryObj<typeof SplittingAsyncDominosComponent>

export const SplittingAsyncDominos: Story = {
	parameters: {
		docs: {
			source: {
				code: SplittingAsyncDominosSource,
				language: 'tsx',
			},
		},
	},
}

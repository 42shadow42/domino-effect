import { Meta, StoryObj } from '@storybook/react'
import { CustomStores as CustomStoresComponent } from './CustomStores'
// @ts-ignore
import CustomStoresSource from './CustomStores?raw'

const meta: Meta = {
	title: 'Domino/Rules',
	component: CustomStoresComponent,
}

export default meta
type Story = StoryObj<typeof CustomStoresComponent>

export const CustomStores: Story = {
	parameters: {
		docs: {
			source: {
				code: CustomStoresSource,
				language: 'tsx',
			},
		},
	},
}

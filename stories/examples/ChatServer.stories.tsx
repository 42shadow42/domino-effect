import { Meta, StoryObj } from '@storybook/react'
import { ChatServer as ChatServerComponent } from './ChatServer'
// @ts-ignore
import ChatServerSource from './ChatServer?raw'

const meta: Meta = {
	title: 'Domino/Examples',
	component: ChatServerComponent,
}

export default meta
type Story = StoryObj<typeof ChatServerComponent>

export const ChatServer: Story = {
	parameters: {
		docs: {
			source: {
				code: ChatServerSource,
				language: 'tsx',
			},
		},
	},
}

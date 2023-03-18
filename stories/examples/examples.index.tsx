import { NPMRegistry as NPMRegistryComponent } from './NPMRegistry'
// @ts-ignore
import NPMRegistrySource from './NPMRegistry?raw'

export const NPMRegistry = NPMRegistryComponent.bind({})
// @ts-ignore
NPMRegistry.parameters = {
	docs: {
		source: {
			code: NPMRegistrySource,
			language: 'tsx',
			type: 'code',
		},
	},
}

import { ChatServer as ChatServerComponent } from './ChatServer'
// @ts-ignore
import ChatServerSource from './ChatServer?raw'

export const ChatServer = ChatServerComponent.bind({})
// @ts-ignore
ChatServer.parameters = {
	docs: {
		source: {
			code: ChatServerSource,
			language: 'tsx',
			type: 'code',
		},
	},
}

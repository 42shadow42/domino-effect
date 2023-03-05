import { NPMRegistry as NPMRegistryComponent } from './NPMRegistry'
// @ts-ignore
import NPMRegistrySource from '!!raw-loader!./NPMRegistry'

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
import ChatServerSource from '!!raw-loader!./ChatServer'

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

export default {
	NPMRegistry,
}


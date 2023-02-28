import { NPMRegistry as NPMRegistryComponent } from './NPMRegistry'
// @ts-ignore
import NPMRegistrySource from '!!raw-loader!./NPMRegistry'

const NPMRegistry = NPMRegistryComponent.bind({})
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

export default {
	NPMRegistry,
}

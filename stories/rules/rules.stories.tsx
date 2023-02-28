import { Trigger as TriggerComponent } from './Trigger'
// @ts-ignore
import TriggerSource from '!!raw-loader!./Trigger'

export const Trigger = TriggerComponent.bind({})
// @ts-ignore
Trigger.parameters = {
	docs: {
		source: {
			code: TriggerSource,
			language: 'tsx',
		},
	},
}

import { Domino as DominoComponent } from './Domino'
// @ts-ignore
import DominoSource from '!!raw-loader!./Domino'

export const Domino = DominoComponent.bind({})
// @ts-ignore
Domino.parameters = {
	docs: {
		source: {
			code: DominoSource,
			language: 'tsx',
		},
	},
}

import { CombiningDominos as CombindingDominosComponent } from './CombiningDominos'
// @ts-ignore
import CombiningDominosSource from '!!raw-loader!./CombiningDominos'

export const CombiningDominos = CombindingDominosComponent.bind({})
// @ts-ignore
CombiningDominos.parameters = {
	docs: {
		source: {
			code: CombiningDominosSource,
			language: 'tsx',
		},
	},
}

import { SplittingComponents as SplittingComponentsComponent } from './SplittingComponents'
// @ts-ignore
import SplittingComponentsSource from '!!raw-loader!./SplittingComponents'

export const SplittingComponents = SplittingComponentsComponent.bind({})
// @ts-ignore
SplittingComponents.parameters = {
	docs: {
		source: {
			code: SplittingComponentsSource,
			language: 'tsx',
		},
	},
}

import { SplittingDominos as SplittingDominosComponent } from './SplittingDominos'
// @ts-ignore
import SplittingDominosSource from '!!raw-loader!./SplittingDominos'

export const SplittingDominos = SplittingDominosComponent.bind({})
// @ts-ignore
SplittingDominos.parameters = {
	docs: {
		source: {
			code: SplittingDominosSource,
			language: 'tsx',
		},
	},
}

import { SplittingAsyncDominos as SplittingAsyncDominosComponent } from './SplittingAsyncDominos'
// @ts-ignore
import SplittingAsyncDominosSource from '!!raw-loader!./SplittingAsyncDominos'

export const SplittingAsyncDominos = SplittingAsyncDominosComponent.bind({})
// @ts-ignore
SplittingAsyncDominos.parameters = {
	docs: {
		source: {
			code: SplittingAsyncDominosSource,
			language: 'tsx',
		},
	},
}

import { Caching as CachingComponent } from './Caching'
// @ts-ignore
import CachingSource from '!!raw-loader!./Caching'

export const Caching = CachingComponent.bind({})
// @ts-ignore
Caching.parameters = {
	docs: {
		source: {
			code: CachingSource,
			language: 'tsx',
		},
	},
}

import { CustomStoresExample as CustomStoresComponent } from './CustomStores'
// @ts-ignore
import CustomStoresSource from '!!raw-loader!./CustomStores'

export const CustomStores = CustomStoresComponent.bind({})
// @ts-ignore
CustomStores.parameters = {
	docs: {
		source: {
			code: CustomStoresSource,
			language: 'tsx',
		},
	},
}
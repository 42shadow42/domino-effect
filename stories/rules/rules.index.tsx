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

import { MultipleDominos as MultipleDominosComponent } from './MultipleDominos'
// @ts-ignore
import MultipleDominosSource from '!!raw-loader!./MultipleDominos'

export const MultipleDominos = MultipleDominosComponent.bind({})
// @ts-ignore
MultipleDominos.parameters = {
	docs: {
		source: {
			code: MultipleDominosSource,
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

import { Context as ContextComponent } from './Context'
// @ts-ignore
import ContextSource from '!!raw-loader!./Context'

export const Context = ContextComponent.bind({})
// @ts-ignore
Context.parameters = {
	docs: {
		source: {
			code: ContextSource,
			language: 'tsx',
		},
	},
}

import { CustomStores as CustomStoresComponent } from './CustomStores'
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

import { ManualCleanup as ManualCleanupComponent } from './ManualCleanup'
// @ts-ignore
import ManualCleanupSource from '!!raw-loader!./ManualCleanup'

export const ManualCleanup = ManualCleanupComponent.bind({})
// @ts-ignore
ManualCleanup.parameters = {
	docs: {
		source: {
			code: ManualCleanupSource,
			language: 'tsx',
		},
	},
}
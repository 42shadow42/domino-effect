import {
	Component,
	ErrorInfo,
	Fragment,
	PropsWithChildren,
	useState,
} from 'react'
import {
	domino,
	trigger,
	DominoSuspense,
	useAsyncDomino,
	useDomino,
	TriggerDomino,
	useLocalStore,
} from '@42shadow42/domino-effect'

type User = {
	username: string
	email: string
}

type Package = {
	name: string
	version: string
	description: string
	keywords: string[]
	date: string
	links: {
		npm: string
		homepage: string
		repository: string
		bugs: string
	}
	publisher: User
	maintainers: User[]
	score: {
		final: number
		detail: {
			quality: number
			popularity: number
			maintenance: number
		}
		searchScore: number
	}
}

type SearchResult = {
	package: Package
}

type SearchResponse = {
	objects: SearchResult[]
	total: number
	time: string
}

const term = trigger(() => 'react')
const results = domino<Promise<SearchResponse>, string>(
	async ({ get, cache, context }) => {
		const value = context || get(term)

		if (cache.has(value)) {
			return cache.get(value) as SearchResponse
		}

		const result = await fetch(
			`https://registry.npmjs.com/-/v1/search?text=${value}`,
		)
		if (result.status !== 200) {
			throw new Error('error retrieving search results')
		}
		const data = await result.json()

		cache.set(value, data)

		return cache.get(value) as SearchResponse
	},
	{ ttl: 30000 },
)

const SearchField = () => {
	const [value, setValue] = useDomino(term)
	return (
		<Fragment>
			<input
				style={{ float: 'left' }}
				type="text"
				value={value}
				onChange={(evt) => setValue(evt.target.value)}
			/>
		</Fragment>
	)
}

type EditablePackage = [Package, (pack: Package) => void, () => void]

const packageEditor = domino<Promise<EditablePackage>, string>(
	async ({ get, context, cache }) => {
		if (cache.has(context)) {
			return cache.get(context)
		}

		const reset = () => cache.delete(context)
		const setPackage = (pack: Package) =>
			cache.set(context, [pack, setPackage, reset])
		const pack = (await get(results, context)).objects.find(
			(object) => object.package.name === context,
		)!.package

		cache.set(context, [pack, setPackage, reset])
		return cache.get(context)
	},
)

type ResultsEditorProps = {
	value: Package
}

const ResultsEditor = ({ value }: ResultsEditorProps) => {
	const [pack, setPack, reset] = useAsyncDomino(packageEditor, {
		context: value.name,
	})
	return (
		<Fragment>
			<h1>{pack.name}</h1>
			<textarea
				style={{ width: '60%' }}
				value={pack!.description}
				onChange={(evt) =>
					setPack({ ...pack!, description: evt.target.value })
				}
			/>
			<br />
			<button onClick={reset}>Reset</button>
		</Fragment>
	)
}

type SearchResultsProps = {
	onSelectPackage: (pack: Package) => void
}

const SearchResults = ({ onSelectPackage }: SearchResultsProps) => {
	const value = useAsyncDomino(results)
	return (
		<ol style={{ float: 'left', clear: 'left' }}>
			{value.objects.map((object) => (
				<li
					key={object.package.name}
					onClick={() => onSelectPackage(object.package)}
				>
					{object.package.name}
				</li>
			))}
		</ol>
	)
}

class ErrorBoundary extends Component<PropsWithChildren<{}>> {
	state: { error?: Error } = {}
	static getDerivedStateFromError(error: Error) {
		return { error: error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		console.error(error, errorInfo)
	}

	render() {
		return (
			<Fragment>
				{this.state.error && (
					<Fragment>
						<h1>{this.state.error.name}</h1>
						<h2>{this.state.error.message}</h2>
						{this.state.error.stack}
					</Fragment>
				)}
				{!this.state.error && this.props.children}
			</Fragment>
		)
	}
}

export const NPMRegistry = () => {
	const [selectedPackage, handleSelectPackage] = useState<Package>()
	return (
		<Fragment>
			<SearchField />
			<ErrorBoundary>
				<DominoSuspense
					fallback="loading"
					props={{ onSelectPackage: handleSelectPackage }}
				>
					{SearchResults}
				</DominoSuspense>
			</ErrorBoundary>
			{selectedPackage && (
				<DominoSuspense
					fallback="loading"
					props={{ value: selectedPackage }}
				>
					{ResultsEditor}
				</DominoSuspense>
			)}
		</Fragment>
	)
}

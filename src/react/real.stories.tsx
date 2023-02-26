import { ComponentStory } from '@storybook/react'
import { Component, ErrorInfo, Fragment, PropsWithChildren } from 'react'
import { domino, trigger } from '../dominos'
import { DominoSuspense } from './suspense'
import { useAsyncDomino } from './useAsyncDomino'
import { useDomino } from './useDomino'

type User = {
	username: string
	email: string
}
type SearchResult = {
	package: {
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
}
type SearchResponse = {
	objects: SearchResult[]
	total: number
	time: string
}

export const NPMRegistry: ComponentStory<typeof Component> = () => {
	const term = trigger('react')
	const results = domino(async ({ get }) => {
		const result = await fetch(
			`https://registry.npmjs.com/-/v1/search?text=${get(term)}`,
		)
		if (result.status !== 200) {
			throw new Error('error retrieving search results')
		}
		return (await result.json()) as SearchResponse
	})

	const SearchField = () => {
		const [value, setValue] = useDomino(term)
		return (
			<Fragment>
				<input
					type="text"
					value={value}
					onChange={(evt) => setValue(evt.target.value)}
				/>
			</Fragment>
		)
	}

	const SearchResults = () => {
		const value = useAsyncDomino(results)
		return (
			<ol>
				{value.objects.map((object) => (
					<li key={object.package.name}>{object.package.name}</li>
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

	return (
		<Fragment>
			<SearchField />
			<ErrorBoundary>
				<DominoSuspense fallback="loading">
					{SearchResults}
				</DominoSuspense>
			</ErrorBoundary>
		</Fragment>
	)
}

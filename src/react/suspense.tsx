import { Fragment, FunctionComponent, ReactNode } from 'react'
import isPromise from 'is-promise'

export type DominoSuspenseProps<TProps> = {
	children: FunctionComponent<TProps>
	fallback: ReactNode
	props: TProps
}

export const DominoSuspense = <TProps extends {}>(
	{ props, children, fallback }: DominoSuspenseProps<TProps>,
	context: any,
) => {
	try {
		return <Fragment>{children(props, context)}</Fragment>
	} catch (error) {
		if (isPromise(error)) {
			return <Fragment>{fallback}</Fragment>
		}
		throw error
	}
}

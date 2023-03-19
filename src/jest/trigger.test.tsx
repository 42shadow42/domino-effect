/**
 * @jest-environment jsdom
 */

import { Fragment, useEffect } from 'react'
import { useDomino, useManagedDomino } from '../react'
import { Store } from '../dominos'
import { core } from './__utils__/dominos'
import { render, cleanup } from '@testing-library/react'
import { core as mock } from './__mocks__/dominos'

jest.useFakeTimers()

jest.mock('./__utils__/dominos', () => require('./__mocks__/dominos'))

describe('mockDomino', () => {
	const Component = () => {
		const [value] = useDomino(core, { context: 'context' })
		return <Fragment>{value}</Fragment>
	}

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should mock get', () => {
		mock.get.mockReturnValue('testing')
		const { container } = render(<Component />)

		expect(container).toMatchSnapshot()
		expect(mock.get).toBeCalledWith(expect.any(Store), 'context')
	})

	it('should mock set', () => {
		const Component = () => {
			const utils = useManagedDomino(core, { context: 'context' })

			useEffect(() => {
				utils.set('testing')
			}, [])

			return <Fragment>{utils.get()}</Fragment>
		}

		render(<Component />)
		cleanup()

		expect(mock.set).toBeCalledWith(expect.any(Store), 'context', 'testing')
	})

	it('should mock subscribe', () => {
		render(<Component />)

		expect(mock.subscribe).toBeCalledWith(
			expect.any(Store),
			'context',
			expect.any(Function),
		)
	})

	it('should mock unsubscribe', () => {
		render(<Component />)
		cleanup()

		expect(mock.unsubscribe).toBeCalledWith(
			expect.any(Store),
			'context',
			expect.any(Function),
		)
	})

	it('should mock delete', () => {
		const Component = () => {
			const utils = useManagedDomino(core, { context: 'context' })

			useEffect(() => {
				utils.delete()
			}, [])

			return <Fragment>{utils.get()}</Fragment>
		}

		render(<Component />)
		cleanup()

		expect(mock.delete).toBeCalledWith(expect.any(Store), 'context')
	})
})

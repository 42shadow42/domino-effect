import { test, expect } from '@playwright/test'

test.describe('Custom Stores', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--custom-stores')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Custom Stores/i)
	})

	test('can set default store', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--custom-stores')

		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /default store/i })
		await input.fill('Default Store')

		expect(await input.inputValue()).toBe('Default Store')
	})

	test('can set custom store', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--custom-stores')

		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /custom store/i })
		await input.fill('Custom Store')

		expect(await input.inputValue()).toBe('Custom Store')
	})

	test('can set local store', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--custom-stores')

		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /local store/i })
		await input.fill('Local Store')

		expect(await input.inputValue()).toBe('Local Store')
	})

	test('are independent', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--custom-stores')

		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const localStoreInput = story.getByRole('textbox', {
			name: /local store/i,
		})
		const localStoreHeading = story.getByRole('heading', {
			name: /local store/i,
		})
		await localStoreInput.fill('Local Store')

		const customStoreInput = story.getByRole('textbox', {
			name: /custom store/i,
		})
		const customStoreHeading = story.getByRole('heading', {
			name: /custom store/i,
		})
		await customStoreInput.fill('Custom Store')

		const defaultStoreInput = story.getByRole('textbox', {
			name: /default store/i,
		})
		const defaultStoreHeading = story.getByRole('heading', {
			name: /default store/i,
		})
		await defaultStoreInput.fill('Global Store')

		expect(await defaultStoreHeading.textContent()).toBe(
			'Global Store world!',
		)
		expect(await customStoreHeading.textContent()).toBe(
			'Custom Store world!',
		)
		expect(await localStoreHeading.textContent()).toBe('Local Store world!')
	})
})

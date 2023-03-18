import { test, expect } from '@playwright/test'

test.describe('Caching', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--caching')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Caching/i)
	})

	test('can edit core value', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--caching')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')

		expect(await input.inputValue()).toBe('Playwright testing')
	})

	test('can view non-cached values', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--caching')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')

		const cachedHeader = story.getByRole('heading', { name: /cached/i })
		expect(await cachedHeader.textContent()).toBe(
			'Playwright testing world!',
		)

		const expiringHeader = story.getByRole('heading', { name: /expiring/i })
		expect(await expiringHeader.textContent()).toBe(
			'Playwright testing world!',
		)
	})

	test('can view cached values', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--caching')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')
		await input.fill('Other value')
		await input.fill('Playwright testing')

		const cachedHeader = story.getByRole('heading', { name: /cached/i })
		expect(await cachedHeader.textContent()).toBe(
			'Playwright testing world! - cached',
		)

		const expiringHeader = story.getByRole('heading', { name: /expiring/i })
		expect(await expiringHeader.textContent()).toBe(
			'Playwright testing world! - cached',
		)
	})

	test('can view expired values', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--caching')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')
		await input.fill('Other value')
		await input.fill('Playwright testing')

		const expiringHeader = story.getByRole('heading', { name: /expiring/i })
		await expiringHeader.getByText(/Playwright testing world!$/i).waitFor()
		expect(await expiringHeader.textContent()).toBe(
			'Playwright testing world!',
		)
	})
})

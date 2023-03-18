import { test, expect } from '@playwright/test'

test.describe('Refresh', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--refresh')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Refresh/i)
	})

	test('should allow editing value', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--refresh')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')

		const heading = story.getByRole('heading', { name: /display value/i })
		expect(await heading.textContent()).toBe(
			'Value: Playwright testing! Changed 1 times!',
		)
	})

	test('should allow deleting value', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--refresh')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /core/i })
		await input.fill('Playwright testing')

		const refresh = story.getByRole('button', { name: /refresh/i })
		await refresh.click()

		const heading = story.getByRole('heading', { name: /display value/i })
		expect(await heading.textContent()).toBe(
			'Value: Playwright testing! Changed 0 times!',
		)
	})
})

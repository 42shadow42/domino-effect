import { test, expect } from '@playwright/test'

test.describe('Trigger', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--trigger')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Trigger/i)
	})

	test('can edit trigger value', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--trigger')
		const story = page.frameLocator(
			'iframe[title="storybook-preview-iframe"]',
		)

		const input = story.getByRole('textbox', { name: /trigger/i })
		await input.fill('Playwright testing')

		expect(await input.inputValue()).toBe('Playwright testing')
	})
})

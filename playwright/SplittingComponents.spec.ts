import { test, expect } from '@playwright/test'

test.describe('Splitting Components', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--splitting-components')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Splitting Components/i)
	})

    test('can edit trigger value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--splitting-components')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /trigger/i })
        await input.fill('Playwright testing')

        expect(await input.inputValue()).toBe('Playwright testing')
    })

    test('can view domino value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--splitting-components')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /trigger/i })
        await input.fill('Playwright testing')

        const text = story.getByRole('heading', { name: /domino/i })

        expect(await text.textContent()).toBe('Playwright testing world!')
    })
})
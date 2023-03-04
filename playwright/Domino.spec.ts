import { test, expect } from '@playwright/test'

test.describe('Domino', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--domino')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Domino/i)
	})

    test('can view domino value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--domino')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const text = story.getByRole('heading', { name: /domino/i })

        expect(await text.textContent()).toBe('Hello world!')
    })
})
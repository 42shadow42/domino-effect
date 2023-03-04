import { test, expect } from '@playwright/test'

test.describe('Splitting Async Dominos', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--splitting-async-dominos')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Splitting Async Dominos/i)
	})

    test('can edit greeting value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--splitting-async-dominos')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /greeting/i })
        await input.fill('Playwright testing')

        expect(await input.inputValue()).toBe('Playwright testing')
    })

    test('can edit target value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--splitting-async-dominos')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /target/i })
        await input.fill('is so fun!')

        expect(await input.inputValue()).toBe('is so fun!')
    })

    test('can view display value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--splitting-async-dominos')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const greetingInput = story.getByRole('textbox', { name: /greeting/i })
        await greetingInput.fill('Playwright testing')

        const targetInput = story.getByRole('textbox', { name: /target/i })
        await targetInput.fill('is so fun!')

        const displayValue = story.getByRole('heading', { name: /display value/i })

        expect(await displayValue.textContent()).toBe('Playwright testing is so fun!')
    })
})
import { test, expect } from '@playwright/test'

test.describe('Context', () => {
	test('loads story', async ({ page }) => {
		await page.goto('?path=/story/domino-rules--context')

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Domino \/ Rules - Context/i)
	})

    test('can edit context value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--context')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /^context$/i })
        await input.fill('Context')

        expect(await input.inputValue()).toBe('Context')
    })

    test('can edit contextual value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--context')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /^contextual value$/i })
        await input.fill('Contextual value')

        expect(await input.inputValue()).toBe('Contextual value')
    })

    test('can edit non contextual value', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--context')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const input = story.getByRole('textbox', { name: /non contextual value/i })
        await input.fill('Non contextual value')

        expect(await input.inputValue()).toBe('Non contextual value')
    })

    test('can view contextual values', async ({ page }) => {
        await page.goto('?path=/story/domino-rules--context')
        const story = page.frameLocator('iframe[title="storybook-preview-iframe"]')

        const contextInput = story.getByRole('textbox', { name: /^context$/i })
        await contextInput.fill('Context')

        await expect(contextInput).toHaveValue('Context')

        const contextualValueInput = story.getByRole('textbox', { name: /^contextual value$/i })
        await contextualValueInput.fill('Contextual value')

        const nonContextualValueInput = story.getByRole('textbox', { name: /non contextual value/i })
        await nonContextualValueInput.fill('Non contextual value')

        expect(await contextualValueInput.inputValue()).toBe('Contextual value')
        expect(await nonContextualValueInput.inputValue()).toBe('Non contextual value')

        await contextInput.fill('Context 2')
        await contextualValueInput.fill('Contextual value 2')

        expect(await contextualValueInput.inputValue()).toBe('Contextual value 2')
        expect(await nonContextualValueInput.inputValue()).toBe('Non contextual value')

        await contextInput.fill('Context')
        expect(await contextualValueInput.inputValue()).toBe('Contextual value')
        expect(await nonContextualValueInput.inputValue()).toBe('Non contextual value')
    })
})
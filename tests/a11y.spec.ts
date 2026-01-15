import AxeBuilder from '@axe-core/playwright';
import { type Page, type TestInfo, expect, test } from '@playwright/test';

async function assertNoA11yViolations(page: Page, testInfo: TestInfo, name: string) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.disableRules(['color-contrast'])
		.analyze();

	await testInfo.attach(`axe-${name}.json`, {
		body: JSON.stringify(results, null, 2),
		contentType: 'application/json',
	});

	expect(results.violations).toEqual([]);
}

test.describe('a11y smoke', () => {
	const cases = [
		{ name: 'home', url: '/' },
		{ name: 'blog-index', url: '/blog/' },
		{ name: 'tags-index', url: '/tags/' },
	];

	for (const c of cases) {
		test(c.name, async ({ page }, testInfo) => {
			await page.goto(c.url);
			await assertNoA11yViolations(page, testInfo, c.name);
		});
	}
});

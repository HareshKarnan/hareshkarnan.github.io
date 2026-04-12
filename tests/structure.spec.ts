import { test, expect } from '@playwright/test';

test.describe('Structural Integrity', () => {
  test('should not have duplicate IDs', async ({ page }) => {
    await page.goto('/');
    const duplicateIds = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      const seen = new Set();
      const duplicates = new Set();
      for (const id of ids) {
        if (seen.has(id)) {
          duplicates.add(id);
        }
        seen.add(id);
      }
      return Array.from(duplicates);
    });
    expect(duplicateIds, `Duplicate IDs found: ${duplicateIds.join(', ')}`).toEqual([]);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    const imagesWithoutAlt = page.locator('img:not([alt]), img[alt=""]');
    const count = await imagesWithoutAlt.count();
    expect(count, 'Some images are missing alt text').toBe(0);
  });

  test('should have essential SEO meta tags', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /.+/);
  });
});

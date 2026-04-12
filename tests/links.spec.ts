import { test, expect } from '@playwright/test';

test.describe('Link Validation', () => {
  test('all images should load correctly', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute('src');
      if (src) {
        const response = await page.request.get(src);
        expect(response.status(), `Image failed to load: ${src}`).toBe(200);
      }
    }
  });

  test('internal data links should be valid', async ({ page }) => {
    await page.goto('/');
    const internalLinks = page.locator('a[href^="data/"], a[href^="misc/"]');
    const linkCount = await internalLinks.count();

    for (let i = 0; i < linkCount; i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');
      if (href) {
        const response = await page.request.get(href);
        expect(response.status(), `Internal link failed: ${href}`).toBe(200);
      }
    }
  });

  test('critical external links should be reachable', async ({ page }) => {
    // We only check a subset of critical external links to avoid long test runs
    const criticalLinks = [
      'https://scholar.google.com/citations?user=VatfufAAAAAJ&hl=en',
      'https://www.linkedin.com/in/hareshkarnan/',
      'https://arxiv.org/abs/2309.09912',
      'https://www.amazon.science/',
    ];

    for (const url of criticalLinks) {
      const response = await page.request.head(url);
      // Some sites might return 403/999 for automated requests, but 200/301/302 is success
      expect([200, 301, 302, 403, 999]).toContain(response.status());
    }
  });
});

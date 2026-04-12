import { test, expect } from '@playwright/test';

test.describe('UI Interactions', () => {
  test('theme switcher should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state
    const html = page.locator('html');
    const initialTheme = await html.getAttribute('data-theme');

    const toggle = page.locator('#checkbox');
    await toggle.click();

    // Verify change
    const nextTheme = await html.getAttribute('data-theme');
    expect(nextTheme).not.toBe(initialTheme);

    // Verify persistence
    await page.reload();
    const reloadedTheme = await html.getAttribute('data-theme');
    expect(reloadedTheme).toBe(nextTheme);
  });

  test('back-to-top button should appear on scroll', async ({ page }) => {
    await page.goto('/');
    
    const backToTop = page.locator('.back-to-top');
    await expect(backToTop).not.toHaveClass(/visible/);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    
    // Wait for visibility class
    await expect(backToTop).toHaveClass(/visible/);

    // Click and check scroll
    await backToTop.click();
    
    // Wait for scroll to complete (smooth)
    await page.waitForFunction(() => window.pageYOffset === 0);
    expect(await page.evaluate(() => window.pageYOffset)).toBe(0);
  });
});

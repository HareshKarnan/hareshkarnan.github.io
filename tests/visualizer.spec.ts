import { test, expect } from '@playwright/test';

test.describe('GRPO Visualizer Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/misc/grpo_visualizer.html');
  });

  test('should render charts and controls', async ({ page }) => {
    await expect(page.locator('#plot')).toBeVisible();
    await expect(page.locator('#plot_mean')).toBeVisible();
    await expect(page.locator('#sliders')).toBeVisible();
  });

  test('should update stats when sliders move', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    const initialStats = await page.locator('#stats').textContent();
    
    await slider.evaluate((el: HTMLInputElement) => {
        el.value = '0.5';
        el.dispatchEvent(new Event('input'));
    });

    const updatedStats = await page.locator('#stats').textContent();
    expect(updatedStats).not.toBe(initialStats);
  });

  test('reset button should clear rewards', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await slider.evaluate((el: HTMLInputElement) => {
        el.value = '0.8';
        el.dispatchEvent(new Event('input'));
    });

    await page.locator('#resetBtn').click();
    const sliderValue = await slider.inputValue();
    expect(Number(sliderValue)).toBe(0);
  });
});

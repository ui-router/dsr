// @ts-check
import { test, expect } from '@playwright/test';

test.describe('example app', () => {
  test('loads', async ({ page }) => {
    await page.goto('/');
  });

  test('renders links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByTestId('navigation').getByRole('link', { name: 'about' })).toBeVisible();
    await expect(page.getByTestId('navigation').getByRole('link', { name: 'continentlist' })).toBeVisible();
  });

  test('renders about by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('This is a trivial Deep State Redirect example app')).toBeVisible();
  });

  test('can navigate to continentlist', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'continentlist' }).click();

    await expect(page.getByText('Africa')).toBeVisible();
    await expect(page.getByText('America')).toBeVisible();
    await expect(page.getByText('Oceania')).toBeVisible();
  });

  test('can navigate to belize', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'continentlist' }).click();
    await page.getByRole('link', { name: 'America' }).click();
    await page.getByRole('link', { name: 'Belize' }).click();
    await expect(page.getByRole('heading', { name: 'Belize' })).toContainText('Belize');
  });

  test('can navigate to belize and back', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'continentlist' }).click();
    await page.getByRole('link', { name: 'America' }).click();
    await expect(page).toHaveURL(/\/America/);

    await page.getByRole('link', { name: 'Belize' }).click();
    await expect(page.getByRole('heading', { name: 'Belize' })).toContainText('Belize');
    await expect(page).toHaveURL(/\/America\/Belize/);

    await page.getByRole('navigation').getByRole('link', { name: 'about' }).click();
    await expect(page.getByText('This is a trivial Deep State Redirect example app')).toBeVisible();
  });

  test('dsr sends you back to belize', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation').getByRole('link', { name: 'continentlist' }).click();
    await page.getByRole('link', { name: 'America' }).click();
    await expect(page).toHaveURL(/\/America/);

    await page.getByRole('link', { name: 'Belize' }).click();
    await expect(page).toHaveURL(/\/America\/Belize/);
    await expect(page.getByRole('heading', { name: 'Belize' })).toContainText('Belize');

    await page.getByRole('navigation').getByRole('link', { name: 'about' }).click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText('This is a trivial Deep State Redirect example app')).toBeVisible();

    await page.getByRole('navigation').getByRole('link', { name: 'continentlist' }).click();
    await expect(page).toHaveURL(/\/America\/Belize/);
    await expect(page.getByRole('heading', { name: 'Belize' })).toContainText('Belize');
  });
});

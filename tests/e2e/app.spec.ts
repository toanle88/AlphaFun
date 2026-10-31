import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('AlphaFun production browser smoke tests', () => {
  test('starts, navigates categories, and changes settings', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'AlphaFun' })).toBeVisible()
    await expect(page.getByTestId('progress')).toHaveText(/\/ 89$/)

    await page.getByRole('button', { name: 'Chữ cái' }).click()
    await expect(page.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByTestId('progress')).toHaveText(/\/ 26$/)

    await page.getByRole('button', { name: 'Open settings' }).click()
    await expect(page.getByRole('dialog', { name: 'Learning settings' })).toBeVisible()
    await page.getByRole('button', { name: 'English' }).click()
    await expect(page.getByRole('button', { name: 'Letters' })).toBeVisible()
    await page.getByRole('button', { name: 'Close settings' }).click()
    await expect(page.getByRole('dialog', { name: 'Learning settings' })).toBeHidden()
  })

  test('keeps navigation and card controls usable on a phone viewport', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
    })
    const page = await context.newPage()
    await page.goto('/')

    const categoryNav = page.getByRole('navigation', { name: 'Chọn chủ đề' })
    await expect(categoryNav).toBeVisible()
    await expect(page.getByRole('button', { name: 'TIẾP THEO' })).toBeVisible()
    await page.getByRole('button', { name: 'Chữ cái' }).click()
    await expect(page.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.locator('body')).toHaveCSS('overflow-x', 'hidden')
    await context.close()
  })

  test('has no axe violations on the app and settings dialog', async ({ page }) => {
    await page.goto('/')
    const appResults = await new AxeBuilder({ page }).analyze()
    expect(appResults.violations).toEqual([])

    await page.getByRole('button', { name: 'Open settings' }).click()
    const dialogResults = await new AxeBuilder({ page }).include('#settings-panel').analyze()
    expect(dialogResults.violations).toEqual([])
  })
})

test.describe('AlphaFun PWA and offline shell', () => {
  test('publishes an installable manifest and registers a service worker', async ({ page }) => {
    await page.goto('/')
    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute('href')
    expect(manifestHref).toBeTruthy()
    const manifest = await page.request.get(manifestHref!)
    expect(manifest.ok()).toBeTruthy()
    const manifestJson = await manifest.json()
    expect(manifestJson).toMatchObject({
      name: 'AlphaFun',
      short_name: 'AlphaFun',
      start_url: '/',
      display: 'standalone',
    })
    expect(manifestJson.icons).toEqual(
      expect.arrayContaining([expect.objectContaining({ sizes: '192x192' })]),
    )

    await expect
      .poll(() =>
        page.evaluate(() =>
          navigator.serviceWorker.ready.then(
            (registration) => registration.active?.scriptURL ?? null,
          ),
        ),
      )
      .toContain('/sw.js')
  })

  test('loads the app shell after network access is disabled', async ({ page, context }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'AlphaFun' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => navigator.serviceWorker.ready.then(() => true)))
      .toBe(true)
    await context.setOffline(true)
    await page.reload()
    await expect(page.getByRole('heading', { name: 'AlphaFun' })).toBeVisible()
  })
})

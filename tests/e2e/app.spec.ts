import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('AlphaFun production browser smoke tests', () => {
  test('starts, navigates categories, and changes settings', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'AlphaFun' })).toBeVisible()
    await expect(page.getByTestId('progress')).toHaveText(/\/ 92$/)

    await page.getByRole('button', { name: 'Chữ cái' }).click()
    await expect(page.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(page.getByTestId('progress')).toHaveText(/\/ 29$/)

    await page.getByRole('button', { name: 'Mở cài đặt' }).click()
    const settingsDialog = page.locator('#settings-panel')
    await expect(settingsDialog).toBeVisible()
    await expect(settingsDialog).toHaveRole('dialog')
    await expect(page).toHaveTitle('AlphaFun - Học mà chơi!')
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
    await settingsDialog.getByRole('button', { name: 'English' }).click()
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    const closeSettingsButton = settingsDialog.getByRole('button', { name: 'Close settings' })
    await expect(closeSettingsButton).toBeVisible()
    await closeSettingsButton.click()
    await expect(settingsDialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Letters' })).toBeVisible()
    await expect(page.getByTestId('progress')).toHaveText(/\/ 26$/)
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

  test('uses the main font for Vietnamese large letters after webfonts load', async ({ page }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      await page.getByRole('button', { name: 'Chữ cái' }).click()
      await page.getByRole('button', { name: 'Mở cài đặt' }).click()
      const settingsDialog = page.getByRole('dialog', { name: 'Cài đặt học tập' })
      await settingsDialog.getByRole('button', { name: 'Tuần tự' }).click()
      await page.keyboard.press('Escape')
      await expect(settingsDialog).toBeHidden()
      await page.getByRole('button', { name: 'TIẾP THEO' }).click()
      await page.evaluate(async () => {
        await document.fonts.ready
      })

      const largeLetter = page.locator('.big-text')
      await expect(largeLetter).toHaveText('Ă')
      expect(
        await largeLetter.evaluate((element) => getComputedStyle(element).fontFamily),
      ).toContain('Nunito')
    }
  })

  test('dismisses settings outside the panel and keeps the heading clear of the close button', async ({
    page,
  }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      await page.getByRole('button', { name: 'Mở cài đặt' }).click()

      const dialog = page.locator('#settings-panel')
      const closeButton = dialog.getByRole('button', { name: 'Đóng cài đặt' })
      const title = dialog.locator('#settings-title')
      const hint = dialog.locator('#settings-hint')
      const [closeBox, titleBox, hintBox] = await Promise.all([
        closeButton.boundingBox(),
        title.boundingBox(),
        hint.boundingBox(),
      ])

      expect(closeBox).not.toBeNull()
      expect(titleBox).not.toBeNull()
      expect(hintBox).not.toBeNull()
      expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(closeBox!.x)
      expect(hintBox!.x + hintBox!.width).toBeLessThanOrEqual(closeBox!.x)

      await page.mouse.click(8, 8)
      await expect(dialog).toBeHidden()
      await expect(page.getByRole('button', { name: 'Mở cài đặt' })).toBeFocused()
    }
  })

  test('has no axe violations on the app and settings dialog', async ({ page }) => {
    await page.goto('/')
    const appResults = await new AxeBuilder({ page }).analyze()
    expect(appResults.violations).toEqual([])

    await page.getByRole('button', { name: 'Mở cài đặt' }).click()
    const settingsPanel = page.locator('#settings-panel')
    await expect(settingsPanel).toHaveCSS('opacity', '1')
    const dialogResults = await new AxeBuilder({ page }).include('#settings-panel').analyze()
    expect(dialogResults.violations).toEqual([])
  })
})

test.describe('AlphaFun PWA and offline shell', () => {
  test('loads the declared favicon without requesting the missing fallback', async ({ page }) => {
    const faviconRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === '/favicon.ico') {
        faviconRequests.push(request.url())
      }
    })

    await page.goto('/')
    const faviconHref = await page.locator('link[rel="icon"]').getAttribute('href')
    expect(faviconHref).toBe('/alphafun-icon.svg')

    const favicon = await page.request.get(new URL(faviconHref!, page.url()).toString())
    expect(favicon.ok()).toBeTruthy()
    expect(favicon.headers()['content-type']).toContain('image/svg+xml')
    expect(faviconRequests).toEqual([])
  })

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

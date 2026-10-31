// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import documentMarkup from '../index.html?raw'

const styles = readFileSync('src/index.css', 'utf8')

describe('mobile responsive layout contract', () => {
  it('keeps the app scrollable and safe-area aware', () => {
    expect(styles).toContain('min-height: 100vh;')
    expect(styles).toContain('min-height: 100svh;')
    expect(styles).toContain('overflow-y: auto;')
    expect(styles).toContain('env(safe-area-inset-top, 0px)')
    expect(styles).toContain('env(safe-area-inset-bottom, 0px)')
    expect(styles).toContain('env(safe-area-inset-left, 0px)')
    expect(styles).toContain('env(safe-area-inset-right, 0px)')
  })

  it('keeps narrow-screen navigation and learning media touch and overflow safe', () => {
    expect(styles).toContain('overflow-x: auto;')
    expect(styles).toContain('touch-action: pan-x;')
    expect(styles).toContain('.learning-visual')
    expect(styles).toContain('max-width: 100%;')
    expect(styles).toContain('overflow-wrap: anywhere;')
  })

  it('allows normal mobile zoom and covers display cutouts', () => {
    expect(documentMarkup).toContain('width=device-width, initial-scale=1.0, viewport-fit=cover')
    expect(documentMarkup).not.toContain('maximum-scale')
    expect(documentMarkup).not.toContain('user-scalable=no')
  })

  it('declares the existing AlphaFun icon as the document favicon', () => {
    expect(documentMarkup).toContain(
      '<link rel="icon" type="image/svg+xml" href="/alphafun-icon.svg" />',
    )
    expect(existsSync('public/alphafun-icon.svg')).toBe(true)
  })
})

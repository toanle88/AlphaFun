// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { OBJECTS, VERBS } from './constants/data'

const imageRoot = 'public'
const viteConfig = readFileSync('vite.config.ts', 'utf8')
const displayArea = readFileSync('src/components/DisplayArea.tsx', 'utf8')

describe('optimized learning assets', () => {
  it('keeps every learning image local, display-sized, and dimensioned', () => {
    const imageItems = [...OBJECTS, ...VERBS]

    expect(imageItems).toHaveLength(34)
    imageItems.forEach((item) => {
      expect(item.image).not.toMatch(/\.png$/)
      expect(existsSync(`${imageRoot}${item.image}`)).toBe(true)
      expect(item.imageWidth).toBeGreaterThan(0)
      expect(item.imageHeight).toBeGreaterThan(0)
    })

    expect(VERBS.every((item) => item.image.endsWith('.webp'))).toBe(true)
    expect(VERBS.every((item) => item.imageWidth <= 512)).toBe(true)
  })

  it('scopes PWA precaching to the app shell and supported learning formats', () => {
    expect(viteConfig).toContain("globPatterns: ['**/*.{js,css,html,svg,webp}']")
    expect(viteConfig).toContain('maximumFileSizeToCacheInBytes: 512 * 1024')
    expect(viteConfig).toContain("src: 'alphafun-icon.svg'")
    expect(viteConfig).toContain("'alphafun-icon-192.png'")
    expect(viteConfig).toContain("'alphafun-icon-512.png'")
    expect(existsSync(`${imageRoot}/alphafun-icon-192.png`)).toBe(true)
    expect(existsSync(`${imageRoot}/alphafun-icon-512.png`)).toBe(true)
  })

  it('reserves image space and loads the first visible learning card eagerly', () => {
    expect(displayArea.match(/width=\{item\.value\.imageWidth\}/g)).toHaveLength(2)
    expect(displayArea.match(/height=\{item\.value\.imageHeight\}/g)).toHaveLength(2)
    expect(displayArea.match(/loading="eager"/g)).toHaveLength(2)
    expect(displayArea.match(/fetchpriority: 'high'/g)).toHaveLength(1)
    expect(displayArea.match(/decoding="async"/g)).toHaveLength(2)
  })
})

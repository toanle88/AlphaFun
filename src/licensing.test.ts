// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { createHash } from 'node:crypto'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  license?: string
  private?: boolean
  version?: string
}
const licenseText = readFileSync('LICENSE', 'utf8')
const readme = readFileSync('README.md', 'utf8')
const thirdPartyNotices = readFileSync('THIRD_PARTY_NOTICES.md', 'utf8')
const assetProvenance = JSON.parse(readFileSync('asset-provenance.json', 'utf8')) as {
  schemaVersion: number
  default: { creator: string; license: string; attribution: string }
  assets: Record<string, { sha256: string; source: string; modifications: string }>
}

const visualAssetPattern = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i
const bundledVisualAssets = [
  ...readdirSync('public/images')
    .filter((file: string) => visualAssetPattern.test(file))
    .map((file: string) => `public/images/${file}`),
  ...readdirSync('public')
    .filter((file: string) => visualAssetPattern.test(file))
    .map((file: string) => `public/${file}`),
].sort()

describe('public release licensing metadata', () => {
  it('declares the MIT license and initial public release', () => {
    expect(packageJson.license).toBe('MIT')
    expect(packageJson.version).toBe('0.1.0')
    expect(packageJson.private).not.toBe(true)
    expect(licenseText).toContain('MIT License')
    expect(licenseText).toContain('Copyright (c) 2026 AlphaFun contributors')
    expect(licenseText).toContain('THE SOFTWARE IS PROVIDED "AS IS"')
  })

  it('documents the license, release tag, and third-party audit', () => {
    expect(readme).toContain('[MIT License](LICENSE)')
    expect(readme).toContain('`0.1.0`')
    expect(readme).toContain('`v0.1.0`')
    expect(existsSync('THIRD_PARTY_NOTICES.md')).toBe(true)
    expect(thirdPartyNotices).toContain('Fredoka')
    expect(thirdPartyNotices).toContain('Nunito')
    expect(thirdPartyNotices).toContain('SIL Open Font License')
    expect(thirdPartyNotices).toContain('lucide-react')
    expect(thirdPartyNotices).toContain('ISC')
    expect(thirdPartyNotices).toContain('34 WebP learning illustrations')
    expect(thirdPartyNotices).toMatch(/AlphaFun contributors grant\s+permission/)
    expect(thirdPartyNotices).toContain('SHA-256 fingerprints')
    expect(thirdPartyNotices).toContain('Learning content audit')
    expect(thirdPartyNotices).not.toContain('unresolved provenance')
    expect(thirdPartyNotices).not.toContain('redistribution rights cannot be verified')
    expect(readme).toMatch(/visual assets are attributed to AlphaFun\s+contributors/)
    expect(readme).not.toContain('have unresolved provenance and are excluded')
  })

  it('records complete, hash-pinned provenance for every bundled visual asset', () => {
    const recordedAssets = Object.keys(assetProvenance.assets).sort()

    expect(assetProvenance.schemaVersion).toBe(1)
    expect(assetProvenance.default).toEqual({
      creator: 'AlphaFun contributors',
      license: 'MIT',
      attribution: 'AlphaFun contributors',
    })
    expect(bundledVisualAssets).toHaveLength(37)
    expect(recordedAssets).toEqual(bundledVisualAssets)

    bundledVisualAssets.forEach((path) => {
      const record = assetProvenance.assets[path]
      const effectiveRecord = { ...assetProvenance.default, ...record }
      expect(effectiveRecord.creator).toBeTruthy()
      expect(effectiveRecord.license).toBe('MIT')
      expect(effectiveRecord.attribution).toBeTruthy()
      expect(effectiveRecord.source).toBeTruthy()
      expect(effectiveRecord.modifications).toBeTruthy()
      const hash = createHash('sha256').update(readFileSync(path)).digest('hex')
      expect(hash).toBe(effectiveRecord.sha256)
    })
  })
})

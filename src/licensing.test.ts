// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  license?: string
  private?: boolean
  version?: string
}
const licenseText = readFileSync('LICENSE', 'utf8')
const readme = readFileSync('README.md', 'utf8')
const thirdPartyNotices = readFileSync('THIRD_PARTY_NOTICES.md', 'utf8')

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
    expect(thirdPartyNotices).toContain("excluded from AlphaFun's MIT license")
    expect(thirdPartyNotices).toContain('redistribution rights cannot be verified')
    expect(thirdPartyNotices).toContain('Learning content audit')
    expect(thirdPartyNotices).toContain('absence does not establish ownership')
    expect(readme).toContain('have unresolved provenance and are excluded')
  })
})

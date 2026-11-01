// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { createHash } from 'node:crypto'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  dependencies?: Record<string, string>
  license?: string
  private?: boolean
  version?: string
}
const pnpmLock = readFileSync('pnpm-lock.yaml', 'utf8')
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

type PackageManifest = {
  license?: string
  version?: string
  homepage?: string
  repository?: string | { url?: string }
}

type NoticeDependency = {
  name: string
  version: string
  license: string
  attributionUrl: string
}

const parseLockfileRuntimeVersions = () => {
  const lines = pnpmLock.split('\n')
  const importerStart = lines.indexOf('  .:')
  const dependenciesStart = lines.indexOf('    dependencies:', importerStart)
  const versions = new Map<string, string>()

  for (let index = dependenciesStart + 1; index < lines.length; index += 1) {
    const packageLine = lines[index].match(/^      ([^:]+):$/)
    if (lines[index].startsWith('    ') && !lines[index].startsWith('      ')) break
    if (!packageLine) continue

    const versionLine = lines[index + 2]?.match(/^        version: (.+)$/)
    if (versionLine) versions.set(packageLine[1], versionLine[1].split('(')[0])
  }

  return versions
}

const normalizeRepositoryUrl = (manifest: PackageManifest) => {
  const repository = manifest.repository
  const rawUrl = typeof repository === 'string' ? repository : repository?.url
  if (!rawUrl) return manifest.homepage?.replace(/\/$/, '')
  if (/^[\w.-]+\/[\w.-]+$/.test(rawUrl)) return `https://github.com/${rawUrl}`
  return rawUrl
    .replace(/^git\+/, '')
    .replace(/\.git$/, '')
    .replace(/\/$/, '')
}

const readPackageManifest = (name: string) =>
  JSON.parse(readFileSync(`node_modules/${name}/package.json`, 'utf8')) as PackageManifest

const parseNoticeDependencies = (): NoticeDependency[] =>
  [
    ...thirdPartyNotices.matchAll(
      /^\| `([^`]+)`\s+\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]+\]\((https?:\/\/[^)]+)\)\s*\|$/gm,
    ),
  ].map(([, name, version, license, attributionUrl]) => ({
    name,
    version,
    license,
    attributionUrl,
  }))

describe('public release licensing metadata', () => {
  it('declares the MIT license and current release version', () => {
    expect(packageJson.license).toBe('MIT')
    expect(packageJson.version).toBe('0.1.8')
    expect(packageJson.private).not.toBe(true)
    expect(licenseText).toContain('MIT License')
    expect(licenseText).toContain('Copyright (c) 2026 AlphaFun contributors')
    expect(licenseText).toContain('THE SOFTWARE IS PROVIDED "AS IS"')
  })

  it('documents the license, release target, and third-party audit', () => {
    expect(readme).toContain('[MIT License](LICENSE)')
    expect(readme).toContain('`0.1.0`')
    expect(readme).toContain('initial public release target')
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

  it('keeps runtime dependency notices aligned with resolved package metadata', () => {
    const directDependencies = Object.keys(packageJson.dependencies ?? {}).sort()
    const noticeDependencies = parseNoticeDependencies()
    const lockfileVersions = parseLockfileRuntimeVersions()

    expect(noticeDependencies.map(({ name }) => name).sort()).toEqual(directDependencies)
    expect(lockfileVersions.size).toBe(directDependencies.length)

    noticeDependencies.forEach(({ name, version, license, attributionUrl }) => {
      const manifest = readPackageManifest(name)
      const resolvedVersion = lockfileVersions.get(name)
      const repositoryUrl = normalizeRepositoryUrl(manifest)

      expect(resolvedVersion, `${name} is missing from the lockfile importer`).toBe(version)
      expect(manifest.version, `${name} manifest version`).toBe(resolvedVersion)
      expect(manifest.license, `${name} license`).toBe(license)
      expect(attributionUrl, `${name} repository link`).toBe(repositoryUrl)
    })
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

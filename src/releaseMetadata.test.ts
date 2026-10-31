// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { execFileSync } from 'node:child_process'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { tmpdir } from 'node:os'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { resolve } from 'node:path'
// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { cwd, execPath } from 'node:process'
import { describe, expect, it } from 'vitest'

const packageManifest = JSON.parse(readFileSync('package.json', 'utf8')) as {
  version?: string
}
const changelog = readFileSync('CHANGELOG.md', 'utf8')
const releaseProcess = readFileSync('docs/release-process.md', 'utf8')
const releaseWorkflow = readFileSync('.github/workflows/release.yml', 'utf8')

describe('release metadata contract', () => {
  it('uses a valid pre-1.0 SemVer version and a matching changelog entry', () => {
    expect(packageManifest.version).toMatch(/^0\.\d+\.\d+$/)
    expect(changelog).toContain(`## [${packageManifest.version}] - `)
  })

  it('documents pre-1.0 breaking-change policy and production safeguards', () => {
    expect(releaseProcess).toContain(
      '0.y.0` minor releases may add features and may contain breaking behavior',
    )
    expect(releaseProcess).toContain('protected `production`')
    expect(releaseProcess).toContain('Never move a published release tag')
  })

  it('records the verified publication decision for the initial release', () => {
    expect(releaseProcess).toContain('canonical repository currently has no `v0.1.0` tag')
    expect(releaseProcess).toContain('`0.1.0` remains unreleased')
    expect(changelog).toContain('It remains unreleased until the')
    expect(changelog).toContain('`v0.1.0` tag and GitHub release will be')
  })

  it('automates exact package-to-tag and dated-release-note validation', () => {
    expect(releaseWorkflow).toContain("tags:\n      - 'v*'")
    expect(releaseWorkflow).toContain(
      "ref: ${{ github.event_name == 'push' && github.ref_name || inputs.release_tag }}",
    )
    expect(releaseWorkflow).toContain('fetch-depth: 0')
    expect(releaseWorkflow).toContain('RELEASE_TAG:')
    expect(releaseWorkflow).toContain('pnpm check:release')
    const releaseChecker = readFileSync('scripts/check-release.mjs', 'utf8')
    expect(releaseChecker).toContain('must exactly match v${version}')
    expect(releaseChecker).toContain('refs/tags/${releaseTag}^{commit}')
    expect(releaseChecker).toContain('tagCommit !== checkedOutCommit')
  })

  it('rejects numeric prerelease identifiers with leading zeroes', () => {
    const fixtureDirectory = mkdtempSync(resolve(tmpdir(), 'alphafun-release-check-'))
    const checkerPath = resolve(cwd(), 'scripts/check-release.mjs')

    try {
      writeFileSync(
        resolve(fixtureDirectory, 'package.json'),
        JSON.stringify({ version: '0.1.0-01' }),
      )
      writeFileSync(resolve(fixtureDirectory, 'CHANGELOG.md'), '## [0.1.0-01] - Unreleased\n')

      expect(() =>
        execFileSync(execPath, [checkerPath], {
          cwd: fixtureDirectory,
          encoding: 'utf8',
          stdio: 'pipe',
        }),
      ).toThrow()
    } finally {
      rmSync(fixtureDirectory, { recursive: true, force: true })
    }
  })

  it('accepts SemVer build metadata in the changelog heading', () => {
    const fixtureDirectory = mkdtempSync(resolve(tmpdir(), 'alphafun-release-check-'))
    const checkerPath = resolve(cwd(), 'scripts/check-release.mjs')

    try {
      writeFileSync(
        resolve(fixtureDirectory, 'package.json'),
        JSON.stringify({ version: '0.1.0+build.1' }),
      )
      writeFileSync(resolve(fixtureDirectory, 'CHANGELOG.md'), '## [0.1.0+build.1] - Unreleased\n')

      expect(
        execFileSync(execPath, [checkerPath], {
          cwd: fixtureDirectory,
          encoding: 'utf8',
          stdio: 'pipe',
        }),
      ).toContain('Release metadata is synchronized for 0.1.0+build.1.')
    } finally {
      rmSync(fixtureDirectory, { recursive: true, force: true })
    }
  })
})

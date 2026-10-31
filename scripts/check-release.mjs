import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const packageManifest = JSON.parse(readFileSync('package.json', 'utf8'))
const changelog = readFileSync('CHANGELOG.md', 'utf8')
const version = packageManifest.version
const releaseTag = process.env.RELEASE_TAG?.trim()
const semverPrereleaseIdentifier = '(?:0|[1-9]\\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)'
const semverPattern = new RegExp(
  `^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-${semverPrereleaseIdentifier}(?:\\.${semverPrereleaseIdentifier})*)?(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$`,
)

if (typeof version !== 'string' || !semverPattern.test(version)) {
  throw new Error(`package.json version must be valid SemVer; received ${String(version)}`)
}

const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const headingPattern = new RegExp(`^## \\[${escapedVersion}\\] - (.+)$`, 'm')
const heading = changelog.match(headingPattern)?.[1]
if (!heading) {
  throw new Error(`CHANGELOG.md must contain a heading for version ${version}`)
}

if (releaseTag && releaseTag !== `v${version}`) {
  throw new Error(`Release tag ${releaseTag} must exactly match v${version}`)
}

if (releaseTag && !/^\d{4}-\d{2}-\d{2}$/.test(heading)) {
  throw new Error(`CHANGELOG.md entry for ${version} must have an ISO release date before tagging`)
}

if (releaseTag) {
  const tagCommit = (() => {
    try {
      return execFileSync('git', ['rev-parse', '--verify', `refs/tags/${releaseTag}^{commit}`], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim()
    } catch {
      throw new Error(`Git tag ${releaseTag} must exist and resolve to a commit`)
    }
  })()
  const checkedOutCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim()

  if (tagCommit !== checkedOutCommit) {
    throw new Error(
      `Checked-out commit ${checkedOutCommit} does not match Git tag ${releaseTag} (${tagCommit})`,
    )
  }
}

console.log(
  `Release metadata is synchronized for ${version}${releaseTag ? ` (${releaseTag})` : ''}.`,
)

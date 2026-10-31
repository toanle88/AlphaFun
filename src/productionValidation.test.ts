// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const deployWorkflow = readFileSync('.github/workflows/deploy.yml', 'utf8')
const contributingGuide = readFileSync('CONTRIBUTING.md', 'utf8')
const deploymentGuide = readFileSync('docs/deployment.md', 'utf8')

describe('production validation contract', () => {
  it('runs the complete application validation before uploading production-dist', () => {
    const uploadPosition = deployWorkflow.indexOf('name: Upload production artifact')
    expect(uploadPosition).toBeGreaterThan(-1)

    const requiredChecks = [
      'run: pnpm check:third-party-notices',
      'run: pnpm check:release',
      'run: pnpm type-check',
      'run: pnpm format:check',
      'run: pnpm lint',
      'run: pnpm test:coverage',
      'run: pnpm build',
      'run: pnpm check:asset-size',
      'run: pnpm exec playwright install --with-deps chromium',
      'run: pnpm test:e2e',
    ]

    requiredChecks.forEach((check) => {
      const checkPosition = deployWorkflow.indexOf(check)
      expect(checkPosition, check).toBeGreaterThan(-1)
      expect(checkPosition, check).toBeLessThan(uploadPosition)
    })
  })

  it('documents the same release checks for contributors and operators', () => {
    const documentedCommands = [
      'pnpm test:coverage',
      'pnpm check:asset-size',
      'pnpm exec playwright install --with-deps chromium',
      'pnpm test:e2e',
    ]

    documentedCommands.forEach((command) => {
      expect(contributingGuide).toContain(command)
    })
    expect(deploymentGuide).toContain('browser/PWA/accessibility checks')
  })
})

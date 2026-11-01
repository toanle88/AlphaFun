// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readme = readFileSync('README.md', 'utf8')

describe('README product documentation', () => {
  it('describes automatic browser voice selection', () => {
    expect(readme).toContain(
      'Text-to-speech with automatic selection of the first matching browser voice',
    )
    expect(readme).toContain(
      'availability and speech behavior depend on the browser and operating system',
    )
    expect(readme).not.toContain('language and available-voice selection')
  })
})

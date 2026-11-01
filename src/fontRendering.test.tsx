// @ts-expect-error Node typings are not a runtime dependency of the browser app.
import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DisplayArea } from './components/DisplayArea'
import { VIETNAMESE_LETTERS } from './constants/data'
import type { AppItem } from './types'

const documentMarkup = readFileSync('index.html', 'utf8')
const styles = readFileSync('src/index.css', 'utf8')
const tailwindConfig = readFileSync('tailwind.config.js', 'utf8')
const representativeVietnameseLetters = 'Ă Â Đ Ê Ô Ơ Ư'.split(' ')

describe('font rendering contract', () => {
  it('uses Nunito for the main stack and requests Vietnamese webfont coverage', () => {
    expect(styles).toContain("--font-main: 'Nunito', sans-serif;")
    expect(styles).toContain("--font-brand: 'Fredoka', sans-serif;")
    expect(tailwindConfig).toContain("main: ['Nunito', 'sans-serif']")
    expect(tailwindConfig).toContain("brand: ['Fredoka', 'sans-serif']")
    expect(documentMarkup).toContain('family=Nunito:ital')
    expect(documentMarkup).toContain('subset=vietnamese,latin')
  })

  it.each(representativeVietnameseLetters)(
    'keeps %s in the main-font large-letter view',
    (letter) => {
      expect(VIETNAMESE_LETTERS).toContain(letter)

      const item: AppItem = { id: `letter:${letter}`, type: 'letter', value: letter, name: letter }
      render(
        <DisplayArea
          item={item}
          lang="vi"
          autoPlay={false}
          progress="1 / 29"
          onRecordingChange={vi.fn()}
        />,
      )

      expect(screen.getByText(letter)).toHaveClass('big-text', 'font-main')
    },
  )
})

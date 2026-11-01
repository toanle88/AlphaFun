import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders AlphaFun header', () => {
    render(<App />)
    expect(screen.getByText('AlphaFun')).toBeInTheDocument()
  })

  it('changes category when clicked', () => {
    render(<App />)
    const lettersBtn = screen.getByText('Chữ cái')
    fireEvent.click(lettersBtn)
    expect(lettersBtn).toHaveClass('is-selected')
    expect(lettersBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('changes language when settings are toggled and clicked', () => {
    render(<App />)
    const settingsBtn = screen.getByRole('button', { name: 'Mở cài đặt' })
    fireEvent.click(settingsBtn)

    const enBtn = screen.getByText('English')
    fireEvent.click(enBtn)

    expect(screen.getByText('Letters')).toBeInTheDocument()
  })

  it('synchronizes Vietnamese and English document language and accessible labels', () => {
    render(<App />)

    expect(document.documentElement).toHaveAttribute('lang', 'vi')
    expect(document.title).toBe('AlphaFun - Học mà chơi!')
    expect(screen.getByRole('button', { name: 'Mở cài đặt' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Thẻ học tập' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Phát cách phát âm' })).toHaveAttribute(
      'title',
      'Phát cách phát âm',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Sẵn sàng')

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    expect(screen.getByRole('dialog', { name: 'Cài đặt học tập' })).toHaveAccessibleDescription(
      'Chạm để thay đổi',
    )
    expect(screen.getByRole('group', { name: 'Ngôn ngữ' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Chế độ' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Thứ tự' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'English' }))

    expect(document.documentElement).toHaveAttribute('lang', 'en')
    expect(document.title).toBe('AlphaFun - Learning is Fun!')
    const englishDialog = screen.getByRole('dialog', { name: 'Learning settings' })
    expect(
      within(englishDialog).getByRole('button', { name: 'Close settings' }),
    ).toBeInTheDocument()
    expect(englishDialog).toHaveAccessibleDescription('Tap to change')
    expect(screen.getByRole('group', { name: 'Language' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Mode' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Order' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Choose a category' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /Category position \d+ \/ 89/ })).toBeInTheDocument()
    expect(screen.getByLabelText('Audio controls')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play pronunciation' })).toHaveAttribute(
      'title',
      'Play pronunciation',
    )
    expect(screen.getByRole('button', { name: 'Next item' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Ready')
  })

  it('shows progress for the active category and exposes settings state', () => {
    render(<App />)

    expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 92$/)
    expect(screen.getByRole('group', { name: /Vị trí trong danh mục/ })).toHaveAccessibleName(
      /Vị trí trong danh mục \d+ \/ 92/,
    )

    const settingsBtn = screen.getByRole('button', { name: 'Mở cài đặt' })
    expect(settingsBtn).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(settingsBtn)

    expect(screen.getByRole('dialog', { name: 'Cài đặt học tập' })).toHaveAttribute(
      'aria-modal',
      'true',
    )
    expect(settingsBtn).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: 'Cài đặt học tập' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mở cài đặt' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('moves focus into settings and restores it after Escape or dialog dismissal', () => {
    render(<App />)

    const settingsBtn = screen.getByRole('button', { name: 'Mở cài đặt' })
    fireEvent.click(settingsBtn)
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.getByRole('button', { name: 'Mở cài đặt' })).toHaveFocus()

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    expect(screen.getByRole('button', { name: 'Tiếng Việt' })).toHaveFocus()
    fireEvent.click(
      within(screen.getByRole('dialog', { name: 'Cài đặt học tập' })).getByRole('button', {
        name: 'Đóng cài đặt',
      }),
    )
    expect(screen.getByRole('button', { name: 'Mở cài đặt' })).toHaveFocus()
  })

  it('wraps Tab focus within the modal settings panel', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))

    const firstControl = screen.getByRole('button', { name: 'Tiếng Việt' })
    const dialog = screen.getByRole('dialog', { name: 'Cài đặt học tập' })
    const lastControl = within(dialog).getByRole('button', { name: 'Đóng cài đặt' })

    fireEvent.keyDown(lastControl, { key: 'Tab' })
    expect(firstControl).toHaveFocus()

    fireEvent.keyDown(firstControl, { key: 'Tab', shiftKey: true })
    expect(lastControl).toHaveFocus()
  })

  it('returns focus to the modal when focus is moved to the background', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))

    const firstControl = screen.getByRole('button', { name: 'Tiếng Việt' })
    fireEvent.focus(document.body)

    expect(firstControl).toHaveFocus()
  })

  it('isolates background controls while settings is open', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))

    expect(
      within(screen.getByRole('dialog', { name: 'Cài đặt học tập' })).getByRole('button', {
        name: 'Đóng cài đặt',
      }),
    ).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Chữ cái' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Phát cách phát âm' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Mục tiếp theo' })).toBeDisabled()
    expect(screen.getByRole('heading', { name: 'AlphaFun' }).parentElement).toHaveAttribute('inert')
    expect(screen.getByRole('navigation').parentElement).toHaveAttribute('inert')
    expect(screen.getByRole('main').parentElement).toHaveAttribute('inert')
    const settingsTrigger = screen
      .getByRole('banner')
      .querySelector<HTMLButtonElement>('.icon-button')
    expect(settingsTrigger).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))
    expect(screen.getByRole('button', { name: 'Tất cả' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('exposes names and states for the main learning controls', () => {
    render(<App />)

    screen.getAllByRole('button').forEach((button) => {
      expect(button).toHaveAccessibleName()
    })
    expect(screen.getByRole('button', { name: 'Tất cả' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Ghi âm giọng nói' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('status')).toHaveTextContent('Sẵn sàng')
  })

  it('announces the selected value in every settings group', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))

    const assertPressed = (name: string, pressed: boolean) => {
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', String(pressed))
    }

    assertPressed('Tiếng Việt', true)
    assertPressed('English', false)
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    assertPressed('Tiếng Việt', false)
    assertPressed('English', true)

    assertPressed('Manual', true)
    assertPressed('Auto', false)
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }))
    assertPressed('Manual', false)
    assertPressed('Auto', true)

    assertPressed('Random', true)
    assertPressed('Normal', false)
    fireEvent.click(screen.getByRole('button', { name: 'Normal' }))
    assertPressed('Random', false)
    assertPressed('Normal', true)
  })

  it('keeps every main control keyboard-focusable', () => {
    render(<App />)

    screen.getAllByRole('button').forEach((button) => {
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  it('updates the progress total when a category is selected', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))

    expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 29$/)
    expect(screen.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps progress totals aligned with every category and sequential order', () => {
    render(<App />)

    const categoryTotals = [
      ['Tất cả', 92],
      ['Chữ cái', 29],
      ['Chữ số', 9],
      ['Đồ vật', 20],
      ['Màu sắc', 11],
      ['Hành động', 14],
      ['Hình khối', 9],
    ] as const

    categoryTotals.forEach(([label, total]) => {
      fireEvent.click(screen.getByRole('button', { name: label }))
      expect(screen.getByTestId('progress')).toHaveTextContent(new RegExp(`/ ${total}$`))
    })

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tuần tự' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))
    expect(screen.getByTestId('progress')).toHaveTextContent('1 / 29')

    fireEvent.click(screen.getByText('TIẾP THEO'))
    expect(screen.getByTestId('progress')).toHaveTextContent('2 / 29')
    expect(screen.getByRole('group', { name: 'Vị trí trong danh mục 2 / 29' })).toBeInTheDocument()
  })

  it('describes random progress as the selected card position in the category', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    render(<App />)

    expect(screen.getByTestId('progress')).toHaveTextContent('92 / 92')
    expect(screen.getByRole('group', { name: 'Vị trí trong danh mục 92 / 92' })).toBeInTheDocument()
  })

  it('updates the letters pool and total when the language changes', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))

    expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 29$/)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.getByRole('button', { name: 'Letters' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 26$/)
  })

  it('displays next item when next button is clicked', () => {
    render(<App />)
    const nextBtn = screen.getByText('TIẾP THEO')
    screen.getByTestId('display-item')
    fireEvent.click(nextBtn)
    expect(nextBtn).toBeInTheDocument()
  })
})

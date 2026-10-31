import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
        const settingsBtn = screen.getByRole('button', { name: 'Open settings' })
        fireEvent.click(settingsBtn)

        const enBtn = screen.getByText('English')
        fireEvent.click(enBtn)

        expect(screen.getByText('Letters')).toBeInTheDocument()
    })

    it('shows progress for the active category and exposes settings state', () => {
        render(<App />)

        expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 89$/)

        const settingsBtn = screen.getByRole('button', { name: 'Open settings' })
        expect(settingsBtn).toHaveAttribute('aria-expanded', 'false')
        fireEvent.click(settingsBtn)

        expect(screen.getByRole('dialog', { name: 'Learning settings' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Close settings' })).toHaveAttribute('aria-expanded', 'true')

        fireEvent.keyDown(document, { key: 'Escape' })
        expect(screen.queryByRole('dialog', { name: 'Learning settings' })).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Open settings' })).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates the progress total when a category is selected', () => {
        render(<App />)

        fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))

        expect(screen.getByTestId('progress')).toHaveTextContent(/\/ 26$/)
        expect(screen.getByRole('button', { name: 'Chữ cái' })).toHaveAttribute('aria-pressed', 'true')
    })

    it('keeps progress totals aligned with every category and sequential order', () => {
        render(<App />)

        const categoryTotals = [
            ['Tất cả', 89],
            ['Chữ cái', 26],
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

        fireEvent.click(screen.getByRole('button', { name: 'Open settings' }))
        fireEvent.click(screen.getByRole('button', { name: 'Normal' }))
        fireEvent.click(screen.getByRole('button', { name: 'Chữ cái' }))
        expect(screen.getByTestId('progress')).toHaveTextContent('1 / 26')

        fireEvent.click(screen.getByText('TIẾP THEO'))
        expect(screen.getByTestId('progress')).toHaveTextContent('2 / 26')
    })

    it('displays next item when next button is clicked', () => {
        render(<App />)
        const nextBtn = screen.getByText('TIẾP THEO')
        screen.getByTestId('display-item')
        fireEvent.click(nextBtn)
        expect(nextBtn).toBeInTheDocument()
    })
})

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
        expect(lettersBtn).toHaveClass('bg-primary')
    })

    it('changes language when settings are toggled and clicked', () => {
        render(<App />)
        const settingsBtn = screen.getByRole('button', { name: '' })
        fireEvent.click(settingsBtn)

        const enBtn = screen.getByText('English')
        fireEvent.click(enBtn)

        expect(screen.getByText('Letters')).toBeInTheDocument()
    })

    it('displays next item when next button is clicked', () => {
        render(<App />)
        const nextBtn = screen.getByText('TIẾP THEO')
        screen.getByTestId('display-item')
        fireEvent.click(nextBtn)
        expect(nextBtn).toBeInTheDocument()
    })
})

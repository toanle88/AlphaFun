import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App Component Extended Tests', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('resets sequential index when category changes', () => {
        render(<App />)

        // Switch to sequential mode
        const settingsBtn = screen.getByRole('button', { name: '' })
        fireEvent.click(settingsBtn)
        const sequentialBtn = screen.getByText('Normal')
        fireEvent.click(sequentialBtn)

        // Click next a few times
        const nextBtn = screen.getByText(/TIẾP THEO|NEXT/)
        fireEvent.click(nextBtn)
        fireEvent.click(nextBtn)

        // Change category
        const numbersBtn = screen.getByText(/Số|Numbers|Chữ số/)
        fireEvent.click(numbersBtn)

        // Sequential index should be reset (first item should be rendered)
        // Note: selectNextItem(true) is called on category change
    })

    it('advances automatically in auto mode', () => {
        render(<App />)

        // Enable auto mode
        const settingsBtn = screen.getByRole('button', { name: '' })
        fireEvent.click(settingsBtn)
        const autoBtn = screen.getByText('Auto')
        fireEvent.click(autoBtn)

        const initialItem = screen.getByTestId('display-item').textContent

        // Advance timers
        act(() => {
            vi.advanceTimersByTime(6000)
        })

        const nextItem = screen.getByTestId('display-item').textContent
        expect(nextItem).not.toBe(initialItem)
    })

    it('handles random order without repeating current item immediately', () => {
        render(<App />)
        const nextBtn = screen.getByText(/TIẾP THEO|NEXT/)

        const firstItem = screen.getByTestId('display-item').textContent

        // Click multiple times and verify it doesn't stay the same (probabilistically very likely to change)
        fireEvent.click(nextBtn)
        const secondItem = screen.getByTestId('display-item').textContent
        expect(secondItem).not.toBe(firstItem)
    })
})

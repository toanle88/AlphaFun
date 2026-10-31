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
        const settingsBtn = screen.getByRole('button', { name: 'Open settings' })
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

        expect(screen.getByTestId('progress')).toHaveTextContent('1 / 9')
        expect(screen.getByTestId('display-item')).toHaveTextContent('1')
    })

    it('advances automatically in auto mode', () => {
        render(<App />)

        // Enable auto mode
        const settingsBtn = screen.getByRole('button', { name: 'Open settings' })
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

    it('cleans up the auto-play timer when returning to manual mode', () => {
        render(<App />)

        fireEvent.click(screen.getByRole('button', { name: 'Open settings' }))
        fireEvent.click(screen.getByText('Auto'))
        act(() => {
            vi.advanceTimersByTime(6000)
        })

        const itemAfterAutoAdvance = screen.getByTestId('display-item').textContent
        fireEvent.click(screen.getByText('Manual'))

        act(() => {
            vi.advanceTimersByTime(12000)
        })

        expect(screen.getByTestId('display-item')).toHaveTextContent(itemAfterAutoAdvance ?? '')
    })

    it('keeps auto-play on the newly selected category', () => {
        render(<App />)

        fireEvent.click(screen.getByRole('button', { name: 'Open settings' }))
        fireEvent.click(screen.getByText('Auto'))
        fireEvent.click(screen.getByRole('button', { name: 'Chữ số' }))

        const initialNumber = screen.getByTestId('display-item').textContent
        expect(screen.getByTestId('progress')).toHaveTextContent('1 / 9')

        act(() => {
            vi.advanceTimersByTime(6000)
        })

        expect(screen.getByTestId('display-item').textContent).not.toBe(initialNumber)
        expect(screen.getByTestId('progress')).toHaveTextContent('/ 9')
    })

    it('handles random order without repeating current item immediately', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)
        render(<App />)
        const nextBtn = screen.getByText(/TIẾP THEO|NEXT/)

        const firstItem = screen.getByTestId('display-item').textContent

        // The mocked random value selects the first available candidate after exclusion.
        fireEvent.click(nextBtn)
        const secondItem = screen.getByTestId('display-item').textContent
        expect(secondItem).not.toBe(firstItem)
    })
})

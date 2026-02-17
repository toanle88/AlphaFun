import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('Shapes Navigation Bug', () => {
    it('successfully displays the next shape without disappearing', () => {
        render(<App />)

        // Select Shapes category
        const shapesBtn = screen.getByText(/Hình khối|Shapes/)
        fireEvent.click(shapesBtn)

        // Ensure an item is displayed
        expect(screen.getByTestId('display-item')).toBeInTheDocument()
        const firstShape = screen.getByTestId('display-item').textContent

        // Click NEXT
        const nextBtn = screen.getByText(/TIẾP THEO|NEXT/)
        fireEvent.click(nextBtn)

        // Ensure display item is still there and has changed
        expect(screen.getByTestId('display-item')).toBeInTheDocument()
        const secondShape = screen.getByTestId('display-item').textContent
        expect(secondShape).not.toBe(firstShape)

        // Click NEXT again to be sure
        fireEvent.click(nextBtn)
        expect(screen.getByTestId('display-item')).toBeInTheDocument()
    })
})

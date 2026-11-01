import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

describe('App Component Extended Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('resets sequential index when category changes', () => {
    render(<App />)

    // Switch to sequential mode
    const settingsBtn = screen.getByRole('button', { name: 'Mở cài đặt' })
    fireEvent.click(settingsBtn)
    const sequentialBtn = screen.getByText('Tuần tự')
    fireEvent.click(sequentialBtn)
    fireEvent.keyDown(document, { key: 'Escape' })

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
    const settingsBtn = screen.getByRole('button', { name: 'Mở cài đặt' })
    fireEvent.click(settingsBtn)
    const autoBtn = screen.getByText('Tự động')
    fireEvent.click(autoBtn)

    const initialItem = screen.getByTestId('display-item').textContent

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(6000)
    })

    const nextItem = screen.getByTestId('display-item').textContent
    expect(nextItem).not.toBe(initialItem)
  })

  it('does not replay the current item when voices finish loading', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1)

    act(() => {
      window.speechSynthesis.onvoiceschanged?.(new Event('voiceschanged'))
    })

    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1)
  })

  it('continues from the visible item when order changes during auto-play', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    fireEvent.click(screen.getByText('Tuần tự'))

    expect(screen.getByTestId('display-item')).toHaveTextContent('A')
    expect(screen.getByTestId('progress')).toHaveTextContent('1 / 92')

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByTestId('display-item')).toHaveTextContent('Ă')
    expect(screen.getByTestId('progress')).toHaveTextContent('2 / 92')
  })

  it('keeps the active recording and blocks navigation until it stops', async () => {
    const tracks = [{ stop: vi.fn() }]
    const recorderInstances: Array<{
      onstop: (() => void) | null
      stop: ReturnType<typeof vi.fn>
    }> = []

    class TestMediaRecorder {
      mimeType = 'audio/webm;codecs=opus'
      state = 'inactive'
      stream = { getTracks: () => tracks }
      ondataavailable: ((event: BlobEvent) => void) | null = null
      onstop: (() => void) | null = null

      constructor() {
        recorderInstances.push(this)
      }

      start = vi.fn(() => {
        this.state = 'recording'
      })

      stop = vi.fn(() => {
        this.state = 'inactive'
        this.onstop?.()
      })
    }

    vi.stubGlobal('MediaRecorder', TestMediaRecorder)
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue({
      getTracks: () => tracks,
    } as unknown as MediaStream)

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    fireEvent.keyDown(document, { key: 'Escape' })

    const initialProgress = screen.getByTestId('progress').textContent
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ghi âm giọng nói' }))
      await Promise.resolve()
    })

    expect(screen.getByRole('button', { name: 'Dừng ghi âm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mục tiếp theo' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Chữ số' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Mục tiếp theo' }))
    fireEvent.click(screen.getByRole('button', { name: 'Chữ số' }))
    expect(screen.getByTestId('progress').textContent).toBe(initialProgress)
    expect(screen.getByRole('button', { name: 'Chữ số' })).toHaveAttribute('aria-pressed', 'false')

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(screen.getByTestId('progress').textContent).toBe(initialProgress)
    expect(screen.getByRole('button', { name: 'Dừng ghi âm' })).toBeInTheDocument()
    expect(recorderInstances).toHaveLength(1)
    expect(recorderInstances[0].stop).not.toHaveBeenCalled()
  })

  it('cleans up the auto-play timer when returning to manual mode', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    act(() => {
      vi.advanceTimersByTime(6000)
    })

    const itemAfterAutoAdvance = screen.getByTestId('display-item').textContent
    fireEvent.click(screen.getByText('Thủ công'))

    act(() => {
      vi.advanceTimersByTime(12000)
    })

    expect(screen.getByTestId('display-item')).toHaveTextContent(itemAfterAutoAdvance ?? '')
  })

  it('keeps auto-play on the newly selected category', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    fireEvent.keyDown(document, { key: 'Escape' })
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

  it('shows a completed recording for replay and cleans it up on unmount', async () => {
    const tracks = [{ stop: vi.fn() }]
    const createObjectURL = vi.fn(() => 'blob:app-recording')
    const revokeObjectURL = vi.fn()
    const play = vi.fn(() => Promise.resolve())
    const recorderInstances: Array<{
      ondataavailable: ((event: BlobEvent) => void) | null
    }> = []

    class TestMediaRecorder {
      mimeType = 'audio/webm;codecs=opus'
      state = 'inactive'
      stream = { getTracks: () => tracks }
      ondataavailable: ((event: BlobEvent) => void) | null = null
      onstop: (() => void) | null = null

      constructor() {
        recorderInstances.push(this)
      }

      start = vi.fn(() => {
        this.state = 'recording'
      })

      stop = vi.fn(() => {
        this.state = 'inactive'
        this.onstop?.()
      })
    }

    vi.stubGlobal('MediaRecorder', TestMediaRecorder)
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    vi.stubGlobal(
      'Audio',
      vi.fn(() => ({ play })),
    )
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue({
      getTracks: () => tracks,
    } as unknown as MediaStream)

    const { unmount } = render(<App />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Ghi âm giọng nói' }))
      await Promise.resolve()
    })

    const recorder = recorderInstances[0]
    expect(screen.getByRole('button', { name: 'Dừng ghi âm' })).toBeInTheDocument()

    act(() => {
      recorder.ondataavailable?.({
        data: new Blob(['recorded audio'], { type: 'audio/webm' }),
      } as BlobEvent)
      fireEvent.click(screen.getByRole('button', { name: 'Dừng ghi âm' }))
    })

    expect(screen.getByRole('button', { name: 'Phát bản ghi' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Bản ghi đã sẵn sàng để phát lại')

    unmount()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:app-recording')
  })

  it('clears the auto-play interval when the app unmounts', () => {
    const clearInterval = vi.spyOn(window, 'clearInterval')
    const { unmount } = render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Mở cài đặt' }))
    fireEvent.click(screen.getByText('Tự động'))
    unmount()

    expect(clearInterval).toHaveBeenCalled()
  })
})

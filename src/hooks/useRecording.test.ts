import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRecording } from './useRecording'

describe('useRecording', () => {
  const tracks = [{ stop: vi.fn() }]
  const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:recording')
  const revokeObjectURL = vi.fn()
  const play = vi.fn(() => Promise.resolve())

  class TestMediaRecorder {
    static instances: TestMediaRecorder[] = []
    mimeType = 'audio/webm;codecs=opus'
    state = 'inactive'
    stream = { getTracks: () => tracks }
    ondataavailable: ((event: BlobEvent) => void) | null = null
    onstop: (() => void) | null = null
    start = vi.fn(() => {
      this.state = 'recording'
    })
    stop = vi.fn(() => {
      this.state = 'inactive'
      this.onstop?.()
    })

    constructor() {
      TestMediaRecorder.instances.push(this)
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    TestMediaRecorder.instances = []
    vi.stubGlobal('MediaRecorder', TestMediaRecorder)
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    vi.stubGlobal('Audio', vi.fn(() => ({ play })))
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue({
      getTracks: () => tracks,
    } as unknown as MediaStream)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('keeps a completed recording available for replay and uses the recorder MIME type', async () => {
    const { result, rerender } = renderHook(() => useRecording())
    const cleanupRecording = result.current.cleanupRecording

    await act(async () => {
      await result.current.startRecording()
    })
    act(() => {
      TestMediaRecorder.instances[0].ondataavailable?.({ data: new Blob(['audio'], { type: 'audio/webm' }) } as BlobEvent)
      result.current.stopRecording()
    })
    rerender()

    expect(result.current.audioUrl).toBe('blob:recording')
    expect(result.current.cleanupRecording).toBe(cleanupRecording)
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(createObjectURL.mock.calls[0][0]).toHaveProperty('type', 'audio/webm;codecs=opus')

    act(() => result.current.playRecording())
    expect(play).toHaveBeenCalled()
  })

  it('revokes the URL and stops tracks on explicit cleanup', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })
    act(() => result.current.stopRecording())
    act(() => result.current.cleanupRecording())

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:recording')
    expect(result.current.audioUrl).toBeNull()
    expect(tracks[0].stop).toHaveBeenCalledOnce()
  })

  it('revokes a completed URL when a new recording replaces it', async () => {
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })
    act(() => result.current.stopRecording())
    await act(async () => {
      await result.current.startRecording()
    })

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:recording')
    expect(result.current.isRecording).toBe(true)
  })

  it('stops an active recorder and prevents a late URL on unmount', async () => {
    const { result, unmount } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })
    unmount()

    expect(TestMediaRecorder.instances[0].stop).toHaveBeenCalledOnce()
    expect(tracks[0].stop).toHaveBeenCalledOnce()
    expect(createObjectURL).not.toHaveBeenCalled()
  })
})

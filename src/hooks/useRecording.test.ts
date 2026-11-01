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
    class TestAudio {
      play = play
    }

    vi.stubGlobal('Audio', TestAudio)
    vi.mocked(navigator.mediaDevices.getUserMedia).mockResolvedValue({
      getTracks: () => tracks,
    } as unknown as MediaStream)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('keeps a completed recording available for replay and uses the recorder MIME type', async () => {
    const { result, rerender } = renderHook(() => useRecording())
    const cleanupRecording = result.current.cleanupRecording

    await act(async () => {
      await result.current.startRecording()
    })
    act(() => {
      TestMediaRecorder.instances[0].ondataavailable?.({
        data: new Blob(['audio'], { type: 'audio/webm' }),
      } as BlobEvent)
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

  it('handles microphone permission denial without leaving recording active', async () => {
    const denied = new DOMException('Permission denied', 'NotAllowedError')
    vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValueOnce(denied)
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })

    expect(result.current.isRecording).toBe(false)
    expect(result.current.error).toBe('permission-denied')
    expect(result.current.isPermissionRequesting).toBe(false)
  })

  it('handles browsers without MediaRecorder support', async () => {
    vi.stubGlobal('MediaRecorder', undefined)
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })

    expect(result.current.isRecording).toBe(false)
    expect(tracks[0].stop).toHaveBeenCalled()
    expect(result.current.error).toBe('unsupported')
  })

  it('handles browsers without microphone APIs', async () => {
    const originalMediaDevices = navigator.mediaDevices
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      configurable: true,
    })
    const { result } = renderHook(() => useRecording())

    await act(async () => {
      await result.current.startRecording()
    })

    expect(result.current.isRecording).toBe(false)
    expect(result.current.error).toBe('unsupported')
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true,
    })
  })

  it('allows only one microphone permission request while it is pending', async () => {
    let resolvePermission: ((stream: MediaStream) => void) | undefined
    vi.mocked(navigator.mediaDevices.getUserMedia).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePermission = resolve
        }),
    )
    const { result } = renderHook(() => useRecording())

    let firstRequest: Promise<void> | undefined
    await act(async () => {
      firstRequest = result.current.startRecording()
      await Promise.resolve()
    })

    expect(result.current.isPermissionRequesting).toBe(true)
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledOnce()

    await act(async () => {
      await result.current.startRecording()
    })
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledOnce()

    resolvePermission?.({ getTracks: () => tracks } as unknown as MediaStream)
    await act(async () => {
      await firstRequest
    })

    expect(result.current.isPermissionRequesting).toBe(false)
    expect(result.current.isRecording).toBe(true)
  })
})

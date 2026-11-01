import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSpeech } from './useSpeech'

describe('useSpeech', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sets Vietnamese language explicitly and selects a Vietnamese voice when available', () => {
    const viVoice = { lang: 'vi-VN', name: 'Vietnamese' } as SpeechSynthesisVoice
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([viVoice])
    const { result } = renderHook(() => useSpeech('vi'))

    act(() => result.current.speak('xin chào'))

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0]
    expect(utterance.lang).toBe('vi-VN')
    expect(utterance.voice).toBe(viVoice)
  })

  it('sets English language explicitly without using a Vietnamese fallback voice', () => {
    const viVoice = { lang: 'vi-VN', name: 'Vietnamese' } as SpeechSynthesisVoice
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([viVoice])
    const { result } = renderHook(() => useSpeech('en'))

    act(() => result.current.speak('hello'))

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0]
    expect(utterance.lang).toBe('en-US')
    expect(utterance.voice).toBeNull()
  })

  it('selects an available English voice', () => {
    const enVoice = { lang: 'en-GB', name: 'English' } as SpeechSynthesisVoice
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([enVoice])
    const { result } = renderHook(() => useSpeech('en'))

    act(() => result.current.speak('hello'))

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0]
    expect(utterance.lang).toBe('en-US')
    expect(utterance.voice).toBe(enVoice)
  })

  it('refreshes voices when the browser fires voiceschanged', () => {
    const enVoice = { lang: 'en-US', name: 'English' } as SpeechSynthesisVoice
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([])
    const { result } = renderHook(() => useSpeech('en'))

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([enVoice])
    act(() => window.speechSynthesis.onvoiceschanged?.(new Event('voiceschanged')))
    act(() => result.current.speak('hello'))

    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0]
    expect(utterance.voice).toBe(enVoice)
  })

  it('does not throw when speech synthesis is unavailable', () => {
    vi.stubGlobal('speechSynthesis', undefined)
    const { result } = renderHook(() => useSpeech('en'))

    expect(() => {
      act(() => result.current.speak('hello'))
    }).not.toThrow()
    expect(window.speechSynthesis).toBeUndefined()
  })

  it('does not throw or speak when the utterance constructor is unavailable', () => {
    vi.stubGlobal('SpeechSynthesisUtterance', undefined)
    const { result } = renderHook(() => useSpeech('en'))

    expect(() => {
      act(() => result.current.speak('hello'))
    }).not.toThrow()
    expect(window.speechSynthesis.speak).not.toHaveBeenCalled()
  })

  it('cancels queued speech before replacing it', () => {
    const calls: string[] = []
    vi.mocked(window.speechSynthesis.cancel).mockImplementation(() => {
      calls.push('cancel')
    })
    vi.mocked(window.speechSynthesis.speak).mockImplementation(() => {
      calls.push('speak')
    })
    const { result } = renderHook(() => useSpeech('en'))

    act(() => {
      result.current.speak('first')
      result.current.speak('second')
    })

    expect(calls).toEqual(['cancel', 'speak', 'cancel', 'speak'])
  })

  it('ignores callbacks from an older utterance', () => {
    const { result } = renderHook(() => useSpeech('en'))

    act(() => result.current.speak('first'))
    const firstUtterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0][0]
    act(() => firstUtterance.onstart?.(new Event('start') as SpeechSynthesisEvent))

    act(() => result.current.speak('second'))
    const secondUtterance = vi.mocked(window.speechSynthesis.speak).mock.calls[1][0]
    act(() => secondUtterance.onstart?.(new Event('start') as SpeechSynthesisEvent))
    act(() => firstUtterance.onend?.(new Event('end') as SpeechSynthesisEvent))

    expect(result.current.isSpeaking).toBe(true)
  })

  it('cancels speech when requested and when unmounted', () => {
    const { result, unmount } = renderHook(() => useSpeech('en'))

    act(() => result.current.speak('hello'))
    act(() => result.current.cancelSpeech())
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(2)
    expect(result.current.isSpeaking).toBe(false)

    unmount()
    expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(3)
  })

  it('keeps the speak callback stable while voices load', () => {
    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([])
    const { result } = renderHook(() => useSpeech('en'))
    const speakBeforeVoicesLoad = result.current.speak
    const enVoice = { lang: 'en-US', name: 'English' } as SpeechSynthesisVoice

    vi.mocked(window.speechSynthesis.getVoices).mockReturnValue([enVoice])
    act(() => window.speechSynthesis.onvoiceschanged?.(new Event('voiceschanged')))

    expect(result.current.speak).toBe(speakBeforeVoicesLoad)
  })
})

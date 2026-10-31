import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSpeech } from './useSpeech'

describe('useSpeech', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
})

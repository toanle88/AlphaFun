import { useState, useEffect, useCallback, useRef } from 'react'
import { Language } from '../types'

export const useSpeech = (lang: Language) => {
  const [, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceGenerationRef = useRef(0)

  useEffect(() => {
    const synthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined
    if (!synthesis || typeof synthesis.getVoices !== 'function') {
      return
    }

    const loadVoices = () => {
      const nextVoices = synthesis.getVoices()
      voicesRef.current = nextVoices
      setVoices(nextVoices)
    }

    synthesis.onvoiceschanged = loadVoices
    loadVoices()
    return () => {
      if (synthesis.onvoiceschanged === loadVoices) {
        synthesis.onvoiceschanged = null
      }
    }
  }, [])

  const cancelSpeech = useCallback(() => {
    utteranceGenerationRef.current += 1
    const synthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined
    synthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    return () => {
      utteranceGenerationRef.current += 1
      const synthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined
      synthesis?.cancel()
    }
  }, [])

  const speak = useCallback(
    (text: string) => {
      const synthesis = typeof window !== 'undefined' ? window.speechSynthesis : undefined
      const Utterance = typeof window !== 'undefined' ? window.SpeechSynthesisUtterance : undefined

      if (
        !synthesis ||
        typeof synthesis.cancel !== 'function' ||
        typeof synthesis.speak !== 'function' ||
        typeof Utterance !== 'function'
      ) {
        return
      }

      const generation = ++utteranceGenerationRef.current
      synthesis.cancel()
      setIsSpeaking(false)

      const utterance = new Utterance(text)
      const viVoice = voicesRef.current.find((v) => v.lang.startsWith('vi'))
      const enVoice = voicesRef.current.find((v) => v.lang.startsWith('en'))

      if (lang === 'vi') {
        utterance.lang = 'vi-VN'
        utterance.voice = viVoice || null
      } else {
        utterance.lang = 'en-US'
        utterance.voice = enVoice || null
      }

      utterance.rate = 0.9
      utterance.pitch = 1.1

      utterance.onstart = () => {
        if (utteranceGenerationRef.current === generation) {
          setIsSpeaking(true)
        }
      }
      utterance.onend = () => {
        if (utteranceGenerationRef.current === generation) {
          setIsSpeaking(false)
        }
      }
      utterance.onerror = () => {
        if (utteranceGenerationRef.current === generation) {
          setIsSpeaking(false)
        }
      }

      synthesis.speak(utterance)
    },
    [lang],
  )

  return { speak, cancelSpeech, isSpeaking }
}

import '@testing-library/jest-dom'
import { vi } from 'vitest'

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    getVoices: vi.fn(() => []),
    speak: vi.fn(),
    cancel: vi.fn(),
    speaking: false,
    onvoiceschanged: null,
  },
})

class MockSpeechSynthesisUtterance {
  text: string = ''
  lang: string = ''
  voice: any = null
  onend: any = null
  constructor(text: string) {
    this.text = text
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance
})

class MockMediaRecorder {
  start = vi.fn()
  stop = vi.fn()
  ondataavailable = null
  onstop = null
  state = 'inactive'
  stream = {
    getTracks: () => [{ stop: vi.fn() }]
  }
}

Object.defineProperty(window, 'MediaRecorder', {
  value: MockMediaRecorder
})

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(() => Promise.resolve({
      getTracks: () => [{ stop: vi.fn() }]
    }))
  }
})

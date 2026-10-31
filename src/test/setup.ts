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
  voice: SpeechSynthesisVoice | null = null
  onend: ((event: SpeechSynthesisEvent) => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  value: MockSpeechSynthesisUtterance,
})

class MockMediaRecorder {
  mimeType = 'audio/webm'
  start = vi.fn(() => {
    this.state = 'recording'
  })
  stop = vi.fn(() => {
    this.state = 'inactive'
    this.onstop?.(new Event('stop'))
  })
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: ((event: Event) => void) | null = null
  state = 'inactive'
  stream = {
    getTracks: () => [{ stop: vi.fn() }],
  }
}

Object.defineProperty(window, 'MediaRecorder', {
  value: MockMediaRecorder,
  configurable: true,
  writable: true,
})

Object.defineProperty(navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn(() =>
      Promise.resolve({
        getTracks: () => [{ stop: vi.fn() }],
      }),
    ),
  },
})

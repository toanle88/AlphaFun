import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Language, Mode, Order } from '../types'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface SettingsPanelProps {
  lang: Language
  mode: Mode
  order: Order
  firstControlRef: React.RefObject<HTMLButtonElement | null>
  onLanguageChange: (language: Language) => void
  onModeChange: (mode: Mode) => void
  onOrderChange: (order: Order) => void
  onClose: () => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  lang,
  mode,
  order,
  firstControlRef,
  onLanguageChange,
  onModeChange,
  onOrderChange,
  onClose,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    firstControlRef.current?.focus()

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const containFocus = (event: FocusEvent) => {
      if (panelRef.current?.contains(event.target as Node)) {
        return
      }

      firstControlRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('focusin', containFocus)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('focusin', containFocus)
    }
  }, [firstControlRef, onClose])

  const containFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
    )

    if (focusableElements.length === 0) {
      event.preventDefault()
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  return (
    <div
      id="settings-panel"
      className="settings-panel"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      aria-describedby="settings-hint"
      onKeyDown={containFocus}
    >
      <div className="settings-heading">
        <span id="settings-title">Learning settings</span>
        <span id="settings-hint" className="settings-hint">
          Tap to change
        </span>
      </div>

      <div className="settings-group" role="group" aria-labelledby="language-label">
        <span id="language-label" className="settings-label">
          Ngôn ngữ / Language
        </span>
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-button ${lang === 'vi' ? 'is-selected' : ''}`}
            ref={firstControlRef}
            onClick={() => onLanguageChange('vi')}
            aria-pressed={lang === 'vi'}
          >
            Tiếng Việt
          </button>
          <button
            type="button"
            className={`segment-button ${lang === 'en' ? 'is-selected' : ''}`}
            onClick={() => onLanguageChange('en')}
            aria-pressed={lang === 'en'}
          >
            English
          </button>
        </div>
      </div>

      <div className="settings-group" role="group" aria-labelledby="mode-label">
        <span id="mode-label" className="settings-label">
          Chế độ / Mode
        </span>
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-button ${mode === 'manual' ? 'is-selected' : ''}`}
            onClick={() => onModeChange('manual')}
            aria-pressed={mode === 'manual'}
          >
            Manual
          </button>
          <button
            type="button"
            className={`segment-button ${mode === 'auto' ? 'is-selected' : ''}`}
            onClick={() => onModeChange('auto')}
            aria-pressed={mode === 'auto'}
          >
            Auto
          </button>
        </div>
      </div>

      <div className="settings-group" role="group" aria-labelledby="order-label">
        <span id="order-label" className="settings-label">
          Thứ tự / Order
        </span>
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-button ${order === 'random' ? 'is-selected' : ''}`}
            onClick={() => onOrderChange('random')}
            aria-pressed={order === 'random'}
          >
            Random
          </button>
          <button
            type="button"
            className={`segment-button ${order === 'sequential' ? 'is-selected' : ''}`}
            onClick={() => onOrderChange('sequential')}
            aria-pressed={order === 'sequential'}
          >
            Normal
          </button>
        </div>
      </div>

      <button
        type="button"
        className="settings-close-button"
        onClick={onClose}
        aria-label="Close settings"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  )
}

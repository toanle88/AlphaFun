import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight, Settings } from 'lucide-react'
import { CategoryNav } from './components/CategoryNav'
import { DisplayArea } from './components/DisplayArea'
import { SettingsPanel } from './components/SettingsPanel'
import { useCategoryTheme } from './hooks/useCategoryTheme'
import { useLearningNavigation } from './hooks/useLearningNavigation'
import { Language, Mode } from './types'
import { UI_TEXT } from './constants/data'

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('vi')
  const [mode, setMode] = useState<Mode>('manual')
  const [isRecording, setIsRecording] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const settingsButtonRef = useRef<HTMLButtonElement>(null)
  const firstSettingsControlRef = useRef<HTMLButtonElement>(null)
  const settingsWasOpenRef = useRef(false)
  const {
    category,
    currentItem,
    order,
    progress,
    resetForLanguage,
    selectNextItem,
    setCategory,
    setOrder,
  } = useLearningNavigation({
    initialCategory: 'all',
    initialOrder: 'random',
    language: lang,
    mode,
    isRecording,
    isSettingsOpen: showSettings,
  })

  useCategoryTheme(category)

  const t = UI_TEXT[lang]

  const closeSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  const changeLanguage = useCallback(
    (nextLanguage: Language) => {
      setLang(nextLanguage)
      resetForLanguage(nextLanguage)
    },
    [resetForLanguage],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = t.documentTitle
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t.documentDescription)
  }, [lang, t])

  useLayoutEffect(() => {
    if (showSettings) {
      settingsWasOpenRef.current = true
    } else if (settingsWasOpenRef.current) {
      settingsButtonRef.current?.focus()
      settingsWasOpenRef.current = false
    }
  }, [showSettings])

  if (!currentItem) {
    return null
  }

  return (
    <div id="app" className="app-shell">
      <div className="app-frame">
        <header className="app-header">
          <div inert={showSettings || undefined}>
            <p className="eyebrow">{t.appTagline}</p>
            <h1 className="app-title font-brand">AlphaFun</h1>
          </div>

          <div className="settings-wrap">
            <div inert={showSettings || undefined}>
              <button
                type="button"
                className="icon-button"
                ref={settingsButtonRef}
                onClick={() => setShowSettings((isOpen) => !isOpen)}
                aria-label={showSettings ? t.closeSettings : t.openSettings}
                aria-expanded={showSettings}
                aria-controls="settings-panel"
                aria-haspopup="dialog"
                disabled={showSettings}
              >
                <Settings className="icon-button-icon" aria-hidden="true" />
              </button>
            </div>

            {showSettings && (
              <SettingsPanel
                lang={lang}
                mode={mode}
                order={order}
                firstControlRef={firstSettingsControlRef}
                onLanguageChange={changeLanguage}
                onModeChange={setMode}
                onOrderChange={setOrder}
                onClose={closeSettings}
              />
            )}
          </div>
        </header>

        <div inert={showSettings || undefined}>
          <CategoryNav
            category={category}
            lang={lang}
            disabled={isRecording || showSettings}
            onCategoryChange={setCategory}
          />

          <main className="learning-main">
            <DisplayArea
              item={currentItem}
              lang={lang}
              autoPlay={mode === 'auto'}
              progress={progress}
              disabled={showSettings}
              onRecordingChange={setIsRecording}
            />

            <button
              type="button"
              className="next-button"
              aria-label={t.nextItem}
              onClick={selectNextItem}
              disabled={isRecording || showSettings}
            >
              {t.next} <ChevronRight className="next-icon" aria-hidden="true" />
            </button>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App

import React from 'react'
import { AppItem, Language, ShapeKind } from '../types'
import { useSpeech } from '../hooks/useSpeech'
import { useRecording } from '../hooks/useRecording'
import { Mic, Play, Square, Volume2 } from 'lucide-react'
import { LearningCard } from './LearningCard'
import { UI_TEXT } from '../constants/data'

interface DisplayAreaProps {
  item: AppItem
  lang: Language
  autoPlay: boolean
  progress: string
  disabled?: boolean
  onRecordingChange: (isRecording: boolean) => void
}

const highPriorityImageProps = { fetchpriority: 'high' as const }

export const DisplayArea: React.FC<DisplayAreaProps> = ({
  item,
  lang,
  autoPlay,
  progress,
  disabled = false,
  onRecordingChange,
}) => {
  const { speak, isSpeaking } = useSpeech(lang)
  const { isRecording, audioUrl, startRecording, stopRecording, playRecording, cleanupRecording } =
    useRecording()

  const itemName = typeof item.name === 'string' ? item.name : item.name[lang]

  React.useEffect(() => {
    if (autoPlay) {
      speak(itemName)
    }
  }, [lang, autoPlay, speak, itemName])

  React.useEffect(() => {
    cleanupRecording()
  }, [item.id, cleanupRecording])

  React.useEffect(() => {
    onRecordingChange(isRecording)
  }, [isRecording, onRecordingChange])

  const renderShape = (kind: ShapeKind) => {
    switch (kind) {
      case 'circle':
        return <circle cx="50" cy="50" r="45" fill="currentColor" />
      case 'square':
        return <rect x="10" y="10" width="80" height="80" rx="10" fill="currentColor" />
      case 'triangle':
        return <path d="M50 10 L90 90 L10 90 Z" fill="currentColor" />
      case 'star':
        return (
          <path
            d="M50 5 L63 40 L98 40 L70 60 L80 95 L50 75 L20 95 L30 60 L2 40 L37 40 Z"
            fill="currentColor"
          />
        )
      case 'heart':
        return (
          <path
            d="M50 90 C20 70 5 50 5 30 C5 15 15 5 30 5 C40 5 45 10 50 15 C55 10 60 5 70 5 C85 5 95 15 95 30 C95 50 80 70 50 90"
            fill="currentColor"
          />
        )
      case 'rectangle':
        return <rect x="5" y="25" width="90" height="50" rx="8" fill="currentColor" />
      case 'diamond':
        return <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="currentColor" />
      case 'oval':
        return <ellipse cx="50" cy="50" rx="45" ry="30" fill="currentColor" />
      case 'hexagon':
        return <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" fill="currentColor" />
    }
  }

  const renderVisual = () => {
    if (item.type === 'shape') {
      return (
        <div
          className="learning-visual flex justify-center items-center hover:scale-105 hover:rotate-3 transition-transform duration-300 drop-shadow-md"
          style={{ color: item.value.color }}
        >
          <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
            {renderShape(item.value.kind)}
          </svg>
        </div>
      )
    }

    if (item.type === 'color') {
      return (
        <div
          className="learning-visual rounded-full border-2 border-white shadow-sm hover:scale-105 hover:-rotate-3 transition-transform duration-300"
          style={{ backgroundColor: item.value.hex }}
        />
      )
    }

    if (item.type === 'object') {
      return item.value.image ? (
        <img
          src={item.value.image}
          alt={itemName}
          width={item.value.imageWidth}
          height={item.value.imageHeight}
          loading="eager"
          {...highPriorityImageProps}
          decoding="async"
          className="learning-visual learning-image object-contain drop-shadow-md hover:scale-105 hover:rotate-3 transition-transform duration-300"
        />
      ) : item.value.emoji ? (
        <span className="big-text emoji-text">{item.value.emoji}</span>
      ) : null
    }

    if (item.type === 'verb') {
      return (
        <img
          src={item.value.image}
          alt={itemName}
          width={item.value.imageWidth}
          height={item.value.imageHeight}
          loading="eager"
          {...highPriorityImageProps}
          decoding="async"
          className="learning-visual learning-image object-contain drop-shadow-md hover:scale-105 hover:rotate-3 transition-transform duration-300"
        />
      )
    }

    return <span className="big-text text-primary">{item.value}</span>
  }

  return (
    <LearningCard progress={progress} progressLabel={UI_TEXT[lang].categoryPosition}>
      <div data-testid="display-item" className="animate-pop-in flex flex-col items-center w-full">
        {renderVisual()}

        {item.type !== 'letter' && item.type !== 'number' && (
          <div className="item-name mt-6 font-main text-[clamp(2rem,5vw,3rem)] font-semibold capitalize text-text-main tracking-wider italic">
            {itemName}
          </div>
        )}

        <div className="audio-controls" aria-label="Audio controls">
          <button
            type="button"
            className={`audio-button ${isSpeaking ? 'is-speaking' : ''}`}
            onClick={() => speak(itemName)}
            aria-label="Play pronunciation"
            title="Play pronunciation"
            disabled={disabled}
          >
            <Volume2 aria-hidden="true" />
          </button>

          <button
            type="button"
            className={`audio-button ${isRecording ? 'is-recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            aria-label={isRecording ? 'Stop recording' : 'Record your voice'}
            aria-pressed={isRecording}
            title={isRecording ? 'Stop recording' : 'Record your voice'}
            disabled={disabled}
          >
            {isRecording ? <Square aria-hidden="true" /> : <Mic aria-hidden="true" />}
          </button>

          {audioUrl && (
            <button
              type="button"
              className="audio-button is-playback"
              onClick={playRecording}
              aria-label="Play recording"
              title="Play recording"
              disabled={disabled}
            >
              <Play aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="audio-status" role="status" aria-live="polite">
          {isSpeaking
            ? lang === 'vi'
              ? 'Đang phát âm'
              : 'Speaking'
            : isRecording
              ? lang === 'vi'
                ? 'Đang ghi âm'
                : 'Recording'
              : audioUrl
                ? lang === 'vi'
                  ? 'Bản ghi đã sẵn sàng để phát lại'
                  : 'Recording ready to replay'
                : lang === 'vi'
                  ? 'Sẵn sàng'
                  : 'Ready'}
        </p>
      </div>
    </LearningCard>
  )
}

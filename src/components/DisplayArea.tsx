import React from 'react';
import { AppItem, Language } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useRecording } from '../hooks/useRecording';
import { Mic, Play, Square, Volume2 } from 'lucide-react';

interface DisplayAreaProps {
    item: AppItem;
    lang: Language;
    autoPlay: boolean;
    progress: string;
}

export const DisplayArea: React.FC<DisplayAreaProps> = ({ item, lang, autoPlay, progress }) => {
    const { speak, isSpeaking } = useSpeech(lang);
    const { isRecording, audioUrl, startRecording, stopRecording, playRecording, cleanupRecording } = useRecording();

    const itemName = typeof item.name === 'string' ? item.name : item.name[lang];

    React.useEffect(() => {
        if (autoPlay) {
            speak(itemName);
        }
        cleanupRecording();
    }, [item, lang, autoPlay, speak, itemName, cleanupRecording]);

    return (
        <section className="learning-card" aria-label="Learning card">
            <div className="card-progress" role="status" aria-label={`Progress ${progress}`}>
                <span>Progress</span>
                <strong data-testid="progress">{progress}</strong>
            </div>
            <div data-testid="display-item" className="animate-pop-in flex flex-col items-center w-full">
                {item.type === 'shape' ? (
                    <div
                        className="w-[clamp(150px,30vh,250px)] h-[clamp(150px,30vh,250px)] flex justify-center items-center hover:scale-105 hover:rotate-3 transition-transform duration-300 drop-shadow-md"
                        style={{ color: item.value.color }}
                        dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" width="100%" height="100%">${item.value.svg}</svg>` }}
                    />
                ) : item.type === 'color' ? (
                    <div
                        className="w-[clamp(150px,30vh,250px)] h-[clamp(150px,30vh,250px)] rounded-full border-2 border-white shadow-sm hover:scale-105 hover:-rotate-3 transition-transform duration-300"
                        style={{ backgroundColor: item.value.hex }}
                    />
                ) : item.type === 'object' || item.type === 'verb' ? (
                    (item.type === 'object' && item.value.image) || (item.type === 'verb' && item.value.image) ? (
                        <img
                            src={item.value.image}
                            alt={itemName}
                            className="h-[clamp(150px,30vh,250px)] object-contain drop-shadow-md hover:scale-105 hover:rotate-3 transition-transform duration-300"
                        />
                    ) : (item.type === 'object' && 'emoji' in item.value) ? (
                        <span className="big-text emoji-text">{item.value.emoji}</span>
                    ) : null
                ) : (
                    <span className="big-text text-primary">
                        {item.value}
                    </span>
                )}

                {(item.type !== 'letter' && item.type !== 'number') && (
                    <div className="mt-6 font-main text-[clamp(2rem,5vw,3rem)] font-semibold capitalize text-text-main tracking-wider italic">
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
                    >
                        <Volume2 aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className={`audio-button ${isRecording ? 'is-recording' : ''}`}
                        onClick={isRecording ? stopRecording : startRecording}
                        aria-label={isRecording ? "Stop recording" : "Record your voice"}
                        title={isRecording ? "Stop recording" : "Record your voice"}
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
                        >
                            <Play aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

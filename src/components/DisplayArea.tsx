import React from 'react';
import { AppItem, Language } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { useRecording } from '../hooks/useRecording';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DisplayAreaProps {
    item: AppItem;
    lang: Language;
    autoPlay: boolean;
}

export const DisplayArea: React.FC<DisplayAreaProps> = ({ item, lang, autoPlay }) => {
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
        <div className="h-[clamp(300px,50vh,450px)] flex flex-col justify-center items-center bg-white border-4 border-text-main rounded-3xl relative overflow-hidden p-8 shadow-neo-inset">
            <div data-testid="display-item" className="animate-pop-in flex flex-col items-center w-full">
                {item.type === 'shape' ? (
                    <div
                        className="w-[clamp(150px,30vh,250px)] h-[clamp(150px,30vh,250px)] flex justify-center items-center hover:scale-110 hover:rotate-6 transition-transform duration-300 drop-shadow-xl"
                        style={{ color: item.value.color }}
                        dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 100 100" width="100%" height="100%">${item.value.svg}</svg>` }}
                    />
                ) : item.type === 'color' ? (
                    <div
                        className="w-[clamp(150px,30vh,250px)] h-[clamp(150px,30vh,250px)] rounded-full border-4 border-white shadow-lg hover:scale-110 hover:-rotate-6 transition-transform duration-300"
                        style={{ backgroundColor: item.value.hex }}
                    />
                ) : item.type === 'object' || item.type === 'verb' ? (
                    (item.type === 'object' && item.value.image) || (item.type === 'verb' && item.value.image) ? (
                        <img
                            src={item.value.image}
                            alt={itemName}
                            className="h-[clamp(150px,30vh,250px)] object-contain drop-shadow-xl hover:scale-110 hover:rotate-6 transition-transform duration-300"
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

                <div className="flex gap-4 mt-6 justify-center items-center w-full">
                    <button
                        className={cn(
                            "w-16 h-16 rounded-full border-4 border-text-muted bg-white flex justify-center items-center shadow-neo neo-btn text-2xl",
                            isSpeaking && "animate-pulse shadow-[0_0_15px_var(--primary)]"
                        )}
                        onClick={() => speak(itemName)}
                        title="Phát âm mẫu"
                    >
                        🔊
                    </button>

                    <button
                        className={cn(
                            "w-16 h-16 rounded-full border-4 border-text-muted bg-white flex justify-center items-center shadow-neo neo-btn text-2xl",
                            isRecording && "bg-red-500 text-white animate-record-pulse"
                        )}
                        onClick={isRecording ? stopRecording : startRecording}
                        title={isRecording ? "Dừng ghi âm" : "Ghi âm"}
                    >
                        {isRecording ? '⏹️' : '🎤'}
                    </button>

                    {audioUrl && (
                        <button
                            className="w-16 h-16 rounded-full border-4 border-text-muted bg-white flex justify-center items-center shadow-neo neo-btn text-2xl text-primary"
                            onClick={playRecording}
                            title="Nghe lại"
                        >
                            ▶️
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

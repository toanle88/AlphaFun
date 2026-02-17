import { useState, useEffect, useCallback } from 'react';
import { Language } from '../types';

export const useSpeech = (lang: Language) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const viVoice = voices.find(v => v.lang.startsWith('vi'));
    const enVoice = voices.find(v => v.lang.startsWith('en'));

    if (lang === 'vi') {
      utterance.voice = viVoice || enVoice || null;
    } else {
      utterance.voice = enVoice || viVoice || null;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [voices, lang]);

  return { speak, isSpeaking };
};

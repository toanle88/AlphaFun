import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Language, Category, Mode, Order, AppItem
} from './types';
import {
    LETTERS, NUMBERS, OBJECTS, COLORS, VERBS, SHAPES, UI_TEXT, CATEGORY_THEMES
} from './constants/data';
import { DisplayArea } from './components/DisplayArea';
import { Settings, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('vi');
    const [category, setCategory] = useState<Category>('all');
    const [mode, setMode] = useState<Mode>('manual');
    const [order, setOrder] = useState<Order>('random');
    const [showSettings, setShowSettings] = useState(false);
    const [sequentialIndex, setSequentialIndex] = useState(0);
    const [currentItem, setCurrentItem] = useState<AppItem | null>(null);

    const pool = useMemo(() => {
        let items: AppItem[] = [];
        if (category === 'all' || category === 'letters') {
            items = items.concat(LETTERS.map(l => ({ type: 'letter', value: l, name: l })));
        }
        if (category === 'all' || category === 'numbers') {
            items = items.concat(NUMBERS.map(n => ({ type: 'number', value: n, name: n })));
        }
        if (category === 'all' || category === 'objects') {
            items = items.concat(OBJECTS.map(o => ({ type: 'object', value: o, name: o.name })));
        }
        if (category === 'all' || category === 'colors') {
            items = items.concat(COLORS.map(c => ({ type: 'color', value: c, name: c.name })));
        }
        if (category === 'all' || category === 'verbs') {
            items = items.concat(VERBS.map(v => ({ type: 'verb', value: v, name: v.name })));
        }
        if (category === 'all' || category === 'shapes') {
            items = items.concat(SHAPES.map(s => ({ type: 'shape', value: s, name: s.name })));
        }
        return items;
    }, [category]);

    const selectNextItem = useCallback((isSequentialReset = false) => {
        if (pool.length === 0) return;

        if (order === 'sequential') {
            const idx = isSequentialReset ? 0 : sequentialIndex;
            const nextIdx = (idx + 1) % pool.length;
            setCurrentItem(pool[idx]);
            setSequentialIndex(nextIdx);
        } else {
            let filteredPool = pool;
            if (currentItem && pool.length > 1) {
                filteredPool = pool.filter(p => {
                    const val = typeof p.value === 'string' ? p.value : (p.value as Record<string, unknown>).hex || (p.value as Record<string, unknown>).image;
                    const currVal = typeof currentItem.value === 'string' ? currentItem.value : (currentItem.value as Record<string, unknown>).hex || (currentItem.value as Record<string, unknown>).image;
                    return val !== currVal;
                });
            }
            const randomIdx = Math.floor(Math.random() * filteredPool.length);
            setCurrentItem(filteredPool[randomIdx]);
        }
    }, [pool, order, sequentialIndex, currentItem]);

    useEffect(() => {
        selectNextItem(true);
    }, [category]);

    useEffect(() => {
        let timer: number | null = null;
        if (mode === 'auto') {
            timer = window.setInterval(() => {
                selectNextItem();
            }, 6000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [mode, selectNextItem]);

    useEffect(() => {
        const theme = CATEGORY_THEMES[category];
        const root = document.documentElement;
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--primary-dark', theme.dark);
        root.style.setProperty('--secondary', theme.secondary);
    }, [category]);

    const t = UI_TEXT[lang];

    if (!currentItem) return null;

    return (
        <div id="app" className="w-screen h-screen flex justify-center items-center p-4">
            <div className="container bg-card border-4 border-text-main rounded-3xl p-6 shadow-neo flex flex-col gap-4 max-w-[600px] w-full">
                <header className="flex justify-between items-center mb-2 px-2">
                    <h1 className="font-main font-bold text-[clamp(2rem,6vw,2.8rem)] text-primary drop-shadow-sm select-none">
                        AlphaFun
                    </h1>

                    <div className="relative">
                        <button
                            className="w-12 h-12 rounded-full border-2 border-text-muted bg-white flex justify-center items-center shadow-[0_4px_0_var(--text-muted)] hover:rotate-45 active:translate-y-[2px] active:shadow-[0_2px_0_var(--text-muted)] transition-all"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings className="w-6 h-6 text-text-muted" />
                        </button>

                        {showSettings && (
                            <div className="absolute top-14 right-0 bg-white rounded-2xl p-5 border-4 border-text-main shadow-lg min-w-[220px] z-50 animate-pop-in">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left">Ngôn ngữ / Language</label>
                                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", lang === 'vi' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setLang('vi')}
                                            >
                                                Tiếng Việt
                                            </button>
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", lang === 'en' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setLang('en')}
                                            >
                                                English
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left">Chế độ / Mode</label>
                                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'manual' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setMode('manual')}
                                            >
                                                Manual
                                            </button>
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", mode === 'auto' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setMode('auto')}
                                            >
                                                Auto
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest text-left">Thứ tự / Order</label>
                                        <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", order === 'random' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setOrder('random')}
                                            >
                                                Random
                                            </button>
                                            <button
                                                className={cn("flex-1 py-1.5 rounded-lg text-xs font-bold transition-all", order === 'sequential' ? "bg-primary text-white" : "text-text-muted")}
                                                onClick={() => setOrder('sequential')}
                                            >
                                                Normal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <nav className="flex justify-center gap-3 flex-wrap p-2">
                    {(['all', 'letters', 'numbers', 'objects', 'colors', 'verbs', 'shapes'] as Category[]).map(cat => (
                        <button
                            key={cat}
                            className={cn(
                                "px-5 py-2.5 min-w-[90px] rounded-full border-2 border-text-muted bg-white text-text-muted font-main font-semibold text-sm shadow-[0_4px_0_var(--text-muted)] hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--text-muted)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--text-muted)] transition-all",
                                category === cat && "bg-primary text-white border-primary-dark shadow-[0_4px_0_var(--primary-dark)] hover:shadow-[0_6px_0_var(--primary-dark)] active:shadow-[0_2px_0_var(--primary-dark)]"
                            )}
                            onClick={() => setCategory(cat)}
                        >
                            {t[cat]}
                        </button>
                    ))}
                </nav>

                <DisplayArea item={currentItem} lang={lang} autoPlay={mode === 'auto'} />

                <button
                    className="mt-2 py-4 px-8 w-full max-w-[320px] mx-auto rounded-full border-4 border-primary-dark bg-primary text-white font-main font-bold text-xl shadow-[0_6px_0_var(--primary-dark)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_var(--primary-dark)] active:translate-y-[4px] active:shadow-[0_2px_0_var(--primary-dark)] flex items-center justify-center gap-2 uppercase tracking-wide"
                    onClick={() => selectNextItem()}
                >
                    {t.next} <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default App;

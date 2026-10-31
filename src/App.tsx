import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Language, Category, Mode, Order, AppItem
} from './types';
import {
    LETTERS, NUMBERS, OBJECTS, COLORS, VERBS, SHAPES, UI_TEXT, CATEGORY_THEMES
} from './constants/data';
import { DisplayArea } from './components/DisplayArea';
import { Settings, ChevronRight } from 'lucide-react';

const CATEGORIES: Category[] = ['all', 'letters', 'numbers', 'objects', 'colors', 'verbs', 'shapes'];

const getItemIdentifier = (item: AppItem) => {
    switch (item.type) {
        case 'letter':
        case 'number':
            return `${item.type}:${item.value}`;
        case 'color':
            return `${item.type}:${item.value.hex}`;
        case 'object':
            return `${item.type}:${item.value.image || item.value.emoji || item.value.name.en}`;
        case 'verb':
            return `${item.type}:${item.value.image}`;
        case 'shape':
            return `${item.type}:${item.value.svg}`;
    }
};

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('vi');
    const [category, setCategory] = useState<Category>('all');
    const [mode, setMode] = useState<Mode>('manual');
    const [order, setOrder] = useState<Order>('random');
    const [showSettings, setShowSettings] = useState(false);
    const [sequentialIndex, setSequentialIndex] = useState(0);
    const [currentItem, setCurrentItem] = useState<AppItem | null>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);
    const firstSettingsControlRef = useRef<HTMLButtonElement>(null);
    const settingsWasOpenRef = useRef(false);

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
                filteredPool = pool.filter(p => getItemIdentifier(p) !== getItemIdentifier(currentItem));
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

    useEffect(() => {
        if (!showSettings) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setShowSettings(false);
        };

        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [showSettings]);

    useEffect(() => {
        if (showSettings) {
            firstSettingsControlRef.current?.focus();
            settingsWasOpenRef.current = true;
        } else if (settingsWasOpenRef.current) {
            settingsButtonRef.current?.focus();
            settingsWasOpenRef.current = false;
        }
    }, [showSettings]);

    const t = UI_TEXT[lang];
    const currentPosition = currentItem
        ? pool.findIndex(item => getItemIdentifier(item) === getItemIdentifier(currentItem)) + 1
        : 1;
    const progress = `${Math.max(currentPosition, 1)} / ${pool.length}`;

    if (!currentItem) return null;

    return (
        <div id="app" className="app-shell">
            <div className="app-frame">
                <header className="app-header">
                    <div>
                        <p className="eyebrow">Learn through play</p>
                        <h1 className="app-title">AlphaFun</h1>
                    </div>

                    <div className="settings-wrap">
                        <button
                            type="button"
                            className="icon-button"
                            ref={settingsButtonRef}
                            onClick={() => setShowSettings(!showSettings)}
                            aria-label={showSettings ? 'Close settings' : 'Open settings'}
                            aria-expanded={showSettings}
                            aria-controls="settings-panel"
                            aria-haspopup="dialog"
                        >
                            <Settings className="icon-button-icon" aria-hidden="true" />
                        </button>

                        {showSettings && (
                            <div
                                id="settings-panel"
                                className="settings-panel"
                                role="dialog"
                                aria-labelledby="settings-title"
                                aria-describedby="settings-hint"
                            >
                                <div className="settings-heading">
                                    <span id="settings-title">Learning settings</span>
                                    <span id="settings-hint" className="settings-hint">Tap to change</span>
                                </div>

                                <div className="settings-group" role="group" aria-labelledby="language-label">
                                    <span id="language-label" className="settings-label">Ngôn ngữ / Language</span>
                                    <div className="segmented-control">
                                        <button
                                            type="button"
                                            className={`segment-button ${lang === 'vi' ? 'is-selected' : ''}`}
                                            ref={firstSettingsControlRef}
                                            onClick={() => setLang('vi')}
                                            aria-pressed={lang === 'vi'}
                                        >
                                            Tiếng Việt
                                        </button>
                                        <button
                                            type="button"
                                            className={`segment-button ${lang === 'en' ? 'is-selected' : ''}`}
                                            onClick={() => setLang('en')}
                                            aria-pressed={lang === 'en'}
                                        >
                                            English
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-group" role="group" aria-labelledby="mode-label">
                                    <span id="mode-label" className="settings-label">Chế độ / Mode</span>
                                    <div className="segmented-control">
                                        <button
                                            type="button"
                                            className={`segment-button ${mode === 'manual' ? 'is-selected' : ''}`}
                                            onClick={() => setMode('manual')}
                                            aria-pressed={mode === 'manual'}
                                        >
                                            Manual
                                        </button>
                                        <button
                                            type="button"
                                            className={`segment-button ${mode === 'auto' ? 'is-selected' : ''}`}
                                            onClick={() => setMode('auto')}
                                            aria-pressed={mode === 'auto'}
                                        >
                                            Auto
                                        </button>
                                    </div>
                                </div>

                                <div className="settings-group" role="group" aria-labelledby="order-label">
                                    <span id="order-label" className="settings-label">Thứ tự / Order</span>
                                    <div className="segmented-control">
                                        <button
                                            type="button"
                                            className={`segment-button ${order === 'random' ? 'is-selected' : ''}`}
                                            onClick={() => setOrder('random')}
                                            aria-pressed={order === 'random'}
                                        >
                                            Random
                                        </button>
                                        <button
                                            type="button"
                                            className={`segment-button ${order === 'sequential' ? 'is-selected' : ''}`}
                                            onClick={() => setOrder('sequential')}
                                            aria-pressed={order === 'sequential'}
                                        >
                                            Normal
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <nav className="category-nav" aria-label={lang === 'vi' ? 'Chọn chủ đề' : 'Choose a category'}>
                    {CATEGORIES.map(cat => (
                        <button
                            type="button"
                            key={cat}
                            className={`category-button ${category === cat ? 'is-selected' : ''}`}
                            onClick={() => setCategory(cat)}
                            aria-pressed={category === cat}
                        >
                            {t[cat]}
                        </button>
                    ))}
                </nav>

                <main className="learning-main">
                    <DisplayArea item={currentItem} lang={lang} autoPlay={mode === 'auto'} progress={progress} />

                    <button
                        type="button"
                        className="next-button"
                        aria-label={lang === 'vi' ? 'Mục tiếp theo' : 'Next item'}
                        onClick={() => selectNextItem()}
                    >
                        {t.next} <ChevronRight className="next-icon" aria-hidden="true" />
                    </button>
                </main>
            </div>
        </div>
    );
};

export default App;

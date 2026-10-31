# Architecture and platform expectations

## Application architecture

AlphaFun is a client-rendered React and TypeScript PWA. `src/App.tsx` owns
top-level language, playback mode, and settings visibility, and composes the
navigation and learning views:

- `CategoryNav` changes the active learning category.
- `SettingsPanel` changes language, manual/automatic playback, and item order.
- `DisplayArea` renders the current item and coordinates speech and recording.
- `LearningCard` provides the content card shell.
- `useLearningNavigation` and `src/utils/navigation.ts` calculate category,
  order, and progress state.
- `useSpeech` wraps the browser Web Speech API.
- `useRecording` wraps `getUserMedia` and `MediaRecorder`; recordings are held
  in memory as Blob object URLs and cleaned up when replaced or unmounted.

Learning content and localized labels live in `src/constants/data.ts`, shared
types live in `src/types`, and images/icons are served from `public/`.

## Browser support

Target current browsers that support ES modules, modern CSS flex/grid, service
workers, `MediaRecorder`, and the Web Speech API. Recording requires microphone
permission and a secure context (`https` or `localhost`). Speech voice lists,
pronunciation, offline behavior, and PWA installation UI vary by browser and
operating system. The app does not request camera or location access.

## Accessibility expectations

New controls must be keyboard usable, have an accessible name, expose state
with native semantics or ARIA where needed, and retain a visible focus
indicator. Preserve the existing settings dialog semantics, Escape handling,
focus return, pressed states for toggles, image alternative text, and polite
audio status live region. Do not use color alone to communicate meaning.

Behavior changes should include or update Testing Library coverage, and UI
changes should be checked at narrow and wide viewport sizes. Test with a
keyboard and a screen reader where practical.

## Privacy considerations

The application has no application API calls, analytics, cookies, or
`localStorage` usage. Microphone recording requires explicit browser
permission; the app creates a local in-memory recording and revokes its object
URL during cleanup. The app does not upload recordings. Browser speech
synthesis and voice data are controlled by the browser and operating system and
may use platform services according to their policies. Google Fonts are loaded
from `fonts.googleapis.com` and `fonts.gstatic.com`; changes to external
resources must be documented and reviewed for privacy impact.

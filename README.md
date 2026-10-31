# 🎓 AlphaFun — Bé Tập Nói Thật Vui!

AlphaFun is a colorful, interactive flashcard PWA that helps young children learn to speak. It includes letters, numbers, objects, colors, actions, and shapes in Vietnamese and English.

## Features

- Six learning categories: letters, numbers, objects, colors, actions, and shapes
- Vietnamese and English labels and pronunciation
- Text-to-speech with language and available-voice selection
- Voice recording with replay
- Manual or auto-play navigation in sequential or random order
- Category-specific themes and responsive mobile navigation
- Installable PWA with production asset precaching

## Tech stack

- React 18 and TypeScript
- Vite and `vite-plugin-pwa`
- Tailwind CSS with project-specific styles in `src/index.css`
- Vitest and Testing Library
- pnpm
- Terraform and GitHub Actions for Azure Static Web Apps deployment

## Getting started

### Prerequisites

- Node.js 24 (or a current Node.js release supported by the project)
- pnpm 9.15.9, enabled automatically through the `packageManager` field

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

The app is available at `http://localhost:5173`.

### Validation and production preview

Run the same checks used by the application deployment workflow:

```bash
pnpm type-check
pnpm lint
pnpm test -- --run
pnpm build
```

The production build is written to `dist/`. Preview it locally with:

```bash
pnpm preview
```

Use `pnpm test` without `--run` for Vitest watch mode.

## Browser support and platform limitations

AlphaFun targets current browsers with support for ES modules, CSS flex/grid, service workers, `MediaRecorder`, and the Web Speech API. The exact voice list and PWA installation UI vary by browser and operating system.

- Voice recording requires microphone permission and a secure context: HTTPS in deployment or `localhost` during development. The feature is unavailable when `MediaRecorder` or microphone access is not supported, denied, or blocked by browser policy.
- Speech uses the browser's Web Speech API. Available voices, pronunciation quality, and offline speech support are browser/OS dependent; the app cannot guarantee that a requested voice exists or that speech works without network access.
- The app does not request camera, location, or other permissions.

## PWA installation and offline behavior

The production Vite build generates the PWA manifest and service worker. Workbox precaches the generated JavaScript, CSS, HTML, SVG, and bundled flashcard image assets, so the installed app can load its core interface and local content after a successful online visit and service-worker update.

Installability depends on browser support and deployment over HTTPS (with `localhost` allowed for development). Use the browser's install command or prompt when it is offered. External Google Fonts are not part of the local precache, and microphone access, speech synthesis, and browser voice data are not guaranteed to work offline.

## Project structure

```text
AlphaFun/
├── index.html                 # Document shell and font metadata
├── package.json               # Scripts and dependencies
├── vite.config.ts             # Vite, Vitest, and PWA configuration
├── public/                    # PWA icons and flashcard image assets
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Application composition and settings state
│   ├── components/            # Category navigation, card, display, and settings UI
│   ├── constants/              # Learning data and localized UI text
│   ├── hooks/                  # Theme, navigation, recording, and speech hooks
│   ├── utils/                  # Navigation pool/state helpers
│   ├── types/                  # Shared TypeScript types
│   ├── test/                   # Vitest and browser API setup
│   └── *.test.ts(x)            # Unit, integration, accessibility, and responsive tests
├── docs/                      # Asset and project documentation
├── infra/                     # Terraform configuration for Azure
└── .github/workflows/         # Application and infrastructure automation
```

The image migration and before/after byte counts are recorded in [`docs/image-optimization.md`](docs/image-optimization.md).

## Deployment

The application is deployed as an Azure Static Web App through `.github/workflows/deploy.yml`. That workflow installs the locked dependencies, runs type-checking, linting, the test suite, and the production build, then deploys `dist/`. Infrastructure changes are handled separately by `.github/workflows/infrastructure.yml`.

## License

This project is private.

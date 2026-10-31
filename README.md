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
pnpm format:check
pnpm lint
pnpm test -- --run
pnpm test:coverage
pnpm build
pnpm check:asset-size
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

The production build is written to `dist/`. Preview it locally with:

```bash
pnpm preview
```

Formatting is enforced with Prettier. Run `pnpm exec prettier --write .` while
working, then use `pnpm format:check` to verify the repository. Generated
artifacts—including `dist/`, the PWA manifest and service worker, TypeScript
build-info files, and compiled Vite config output—are ignored and must not be
committed. Oxlint provides the project's JavaScript and TypeScript linting;
the project's accessibility and Testing Library behavior is covered by the
existing automated tests.

Use `pnpm test` without `--run` for Vitest watch mode.

## Browser support and platform limitations

AlphaFun targets current browsers with support for ES modules, CSS flex/grid, service workers, `MediaRecorder`, and the Web Speech API. The exact voice list and PWA installation UI vary by browser and operating system.

- Voice recording requires microphone permission and a secure context: HTTPS in deployment or `localhost` during development. The feature is unavailable when `MediaRecorder` or microphone access is not supported, denied, or blocked by browser policy.
- Recording is intentionally local and temporary: audio is held in memory as a browser object URL, is revoked when replaced or when the page is closed, and is never uploaded by AlphaFun. A parent or guardian should review the browser permission prompt and supervise a child's use; do not enter names or other identifying information into the app or share recordings from the browser.
- Speech uses the browser's Web Speech API. Available voices, pronunciation quality, and offline speech support are browser/OS dependent; the app cannot guarantee that a requested voice exists or that speech works without network access.
- The app does not request camera, location, or other permissions.

AlphaFun is designed as a child-facing learning interface, not an account or
social service. It does not intentionally collect child profiles, analytics,
cookies, or recordings. Guardians remain responsible for deciding whether the
browser, operating system speech services, and external Google Fonts are
appropriate for their setting; those platform services may have their own
privacy policies.

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

Vitest coverage uses the V8 provider with minimum thresholds of 70% for lines,
functions, and statements, and 60% for branches. The Playwright suite runs
against the production preview and checks startup, navigation, settings,
mobile layout, axe accessibility, manifest metadata, service-worker control,
and offline app-shell loading. `pnpm check:asset-size` keeps generated JS,
CSS, and HTML below a 750 KiB total budget.

## Deployment

Pull requests are validated by `.github/workflows/ci.yml`; their staging
previews are managed separately by `.github/workflows/preview.yml`. Approved
pushes or releases targeting `main` are built and deployed by
`.github/workflows/deploy.yml`, which deploys the verified `dist/` artifact.
Infrastructure changes are handled separately by
`.github/workflows/infrastructure.yml`.

## Contributor and maintainer documentation

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md)
- [Architecture, browser, accessibility, and privacy notes](docs/architecture.md)
- [Deployment and rollback runbook](docs/deployment.md)

## License

AlphaFun source code and the bundled illustrations and PWA icons are released
under the [MIT License](LICENSE). The visual assets are original AlphaFun
artwork authored by [`scripts/generate-original-art.mjs`](scripts/generate-original-art.mjs);
their exact hashes and rasterization notes are recorded in
[`asset-provenance.json`](asset-provenance.json). Externally sourced fonts and
dependencies are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

The initial public release is version `0.1.0`, documented by the Git tag
`v0.1.0`.

# Agent instructions

## Working agreement

- Read the issue and existing code before making changes.
- Keep changes focused on the requested behavior.
- Add or update regression tests for behavior changes.
- Run the configured fast checks before handing work back.

## Project-specific notes

### Architecture

- AlphaFun is a client-rendered React 19 and TypeScript PWA built with Vite.
- `src/App.tsx` owns top-level language, playback, and settings state. UI is
  composed from `src/components/`; learning data and localized labels live in
  `src/constants/data.ts`; shared types live in `src/types/`; navigation,
  speech, recording, and theme behavior live in `src/utils/` and `src/hooks/`.
- Browser speech and recording are deliberately wrapped in `useSpeech` and
  `useRecording`. Recording requires microphone permission and a secure
  context, and recordings stay in memory rather than being uploaded.
- `public/` contains static app assets and PWA icons. Azure Static Web Apps
  deployment is configured in `.github/workflows/`; Terraform configuration
  lives in `infra/`.

### Testing

- Use Vitest with Testing Library and the shared browser-API setup in
  `src/test/setup.ts`.
- Run the fast checks with `pnpm type-check`, `pnpm lint`, and
  `pnpm test -- --run`; run `pnpm build` before handoff when build or
  deployment-facing files change.
- Put unit tests beside the implementation where practical. UI behavior
  changes should cover keyboard access, accessible names and states, and
  narrow and wide layouts when relevant.

### Generated files

- `dist/`, the generated PWA manifest, service worker, and Workbox precache
  output are build artifacts and must not be committed.
- Keep `pnpm-lock.yaml` in sync when dependency metadata changes; do not edit
  generated lockfile sections by hand without a dependency change.

### Local development

- Use Node.js 24 and pnpm 9.15.9 (`packageManager` declares the pnpm version).
  Run `pnpm install` followed by `pnpm dev`; the development server is
  available at `http://localhost:5173`.
- Use `pnpm preview` to inspect a production build. Microphone features work
  only on `localhost` or HTTPS and depend on browser support and permission;
  speech voices also vary by browser and operating system.
- Do not add secrets, analytics, cookies, or uploaded user recordings. Keep
  deployment and infrastructure changes separate from application-only work
  and document operational changes in `docs/deployment.md`.

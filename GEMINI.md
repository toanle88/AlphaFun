# AlphaFun AI Context

## Project DNA
- **Framework**: Vite + React + TypeScript (Bundler resolution)
- **Styling**: Tailwind CSS + Neo-brutalism design style
- **Core Goal**: Educational PWA for children (Vietnamese/English)
- **PWA**: Uses `vite-plugin-pwa` for offline capabilities.

## Agent Rules
- **Identifiers**: Always use `string` for unique IDs. NEVER use `IGuid`.
- **Code Style**: Strictly NO comments in the generated code. Logic must be clean and self-explanatory.
- **Demos**: Use `generate_image` tool for missing UI assets or demonstration images.
- **Multi-Agent**: Follow the Coder -> Tester -> Security -> Performance -> Reviewer flow for complex tasks.

## Tooling & Infrastructure
- **Slack Notification**: Use `infra/slack_notify.ps1`.
    - **Security**: Requires `SLACK_WEBHOOK_URL` environment variable. Never hardcode the URL in scripts.
- **Tests**:
    - **Engine**: Vitest + React Testing Library.
    - **Windows Execution**: Run via `.\node_modules\.bin\vitest.cmd run`.
    - **Mocks**: Ensure Speech Synthesis and MediaRecorder are mocked in `src/test/setup.ts`.
- **CI/CD**: GitHub Actions uses `npm install --legacy-peer-deps`.
    - **Compatibility**: `@eslint/js` must be kept at version 9 to align with ESLint 9 peer dependencies.

## Key Components
- `src/App.tsx`: Main logic, state orchestration, and category management.
- `src/components/DisplayArea.tsx`: Rendering of learning items (Letters, Numbers, Shapes, etc.).
- `src/hooks/useSpeech.ts`: Speech synthesis logic.
- `src/hooks/useRecording.ts`: Microphone recording and playback logic.

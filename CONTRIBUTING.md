# Contributing to AlphaFun

Thank you for helping make AlphaFun a welcoming learning tool. Small, focused
pull requests are easiest to review and safest to deploy.

## Before you start

- Read the [Code of Conduct](CODE_OF_CONDUCT.md).
- For security vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of
  opening a public issue.
- Check existing issues and pull requests before starting duplicate work.

## Local setup

AlphaFun uses Node.js 24 and pnpm 9.15.9. Install the declared pnpm version
with Corepack if needed, then install dependencies and start the development
server:

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173`. Use `pnpm preview` to preview a
production build locally.

## Validation

Run the same checks used by the application deployment workflow before opening
a pull request:

```bash
pnpm type-check
pnpm format:check
pnpm lint
pnpm test -- --run
pnpm build
```

When changing a production dependency, also run
`pnpm check:third-party-notices`. This verifies the dependency table against
the lockfile and the installed package manifests; CI runs it automatically.

Use `pnpm test` without `--run` when you want Vitest watch mode. If a check
cannot be run locally, explain why in the pull request.

Use `pnpm exec prettier --write .` to format files before running the checks.
Do not commit generated `dist/`, PWA/Workbox, TypeScript build-info, or
compiled Vite configuration files. The project does not currently add separate
accessibility or Testing Library ESLint plugins; those concerns are covered by
the existing test suite and reviewed UI semantics.

## Branches and commits

Create branches from `main` using a short, descriptive name such as:

- `feat/voice-controls`
- `fix/recording-cleanup`
- `docs/contributing`

Keep commits small and describe the user-visible or maintenance change in the
imperative mood, for example `Document local recording privacy`. Separate
unrelated refactors from feature or documentation changes.

## Pull requests

Use the pull-request template and include:

- what changed and why;
- screenshots or a short recording for meaningful UI changes;
- tests added or updated for behavior changes;
- the validation commands that passed;
- browser and accessibility considerations, where relevant;
- any deployment, privacy, or third-party asset impact.

Pull requests target `main`. Keep the scope focused, respond to review
feedback, and do not commit secrets, generated `dist/` output, or unverified
third-party assets. The required CI checks must pass before merge.

## Design and implementation notes

See [the architecture and platform notes](docs/architecture.md) and the
[deployment and rollback runbook](docs/deployment.md) before changing app
composition, browser APIs, or production infrastructure.

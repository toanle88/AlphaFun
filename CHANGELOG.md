# Changelog

All notable AlphaFun changes are recorded here. Entries are ordered newest
first and use the version from `package.json`; the release workflow verifies
that a published tag is exactly `v<version>`.

## [0.1.10] - 2026-11-01

### Fixed

- Paused automatic navigation and pronunciation while settings are open.
- Prevented overlapping microphone permission requests and added localized,
  accessible recording feedback.
- Scoped speech callbacks to the active utterance and cancelled speech during
  replacement, cancellation, and unmount cleanup.
- Added regression coverage for settings pause/resume and audio lifecycle races.

## [0.1.9] - 2026-11-01

### Fixed

- Use the Vietnamese-capable Nunito font consistently for learning UI and
  large letters, while retaining Fredoka for the Latin-only brand title.

## [0.1.8] - 2026-11-01

### Fixed

- Close the learning settings panel when clicking outside it and keep its
  heading clear of the touch-friendly close button on narrow screens.

## [0.1.7] - 2026-11-01

### Fixed

- Clarified that speech automatically selects the first matching browser voice
  and that voice availability and speech behavior depend on the browser and
  operating system.

## [0.1.6] - 2026-11-01

### Fixed

- Synchronized the document language and localized accessible labels, titles,
  settings text, progress labels, and audio status messages.

## [0.1.5] - 2026-11-01

### Fixed

- Hardened speech synthesis for unsupported browsers, voice loading, and
  queued pronunciation replacement.

## [0.1.4] - 2026-11-01

### Fixed

- Preserved the visible learning card and its next-item position when changing
  between random and sequential order.

## [0.1.3] - 2026-11-01

### Fixed

- Clarified random-mode progress as the selected card's position in its category.

## [0.1.2] - 2026-11-01

### Added

- Complete Vietnamese alphabet content with language-specific letter totals.

## [0.1.1] - 2026-11-01

### Fixed

- Completed settings dialog focus containment and background isolation.

## [0.1.0] - Unreleased

This is the initial public release target. It remains unreleased until the
release process is completed; the `v0.1.0` tag and GitHub release will be
created from the exact merged commit.

### Added

- Child-friendly flashcards for letters, numbers, objects, colors, actions,
  and shapes in Vietnamese and English.
- Browser speech, local voice recording, sequential/random navigation, and PWA
  installation support.
- Production validation, deployment approval, and rollback runbooks.

## Release notes process

For each release, add a new dated section before older entries. Group changes
under `Added`, `Changed`, `Fixed`, `Breaking`, and `Security` as applicable.
Use `Breaking` for any change that requires users to relearn an interaction,
changes keyboard or accessible behavior incompatibly, removes browser support,
changes recording or speech permissions, or changes a persisted/public data
contract. Keep the notes user-facing and link the release tag in the GitHub
release description.

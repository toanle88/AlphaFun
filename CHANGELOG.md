# Changelog

All notable AlphaFun changes are recorded here. Entries are ordered newest
first and use the version from `package.json`; the release workflow verifies
that a published tag is exactly `v<version>`.

## [0.1.0] - Unreleased

This is the initial public release target. As of 2026-10-31, it remains
unreleased; the `v0.1.0` tag and GitHub release will be created from the exact
merged commit after this process change is approved.

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

# SemVer release process

## Version policy

`package.json` is the only version source of truth. Release notes and Git tags
must derive from it; the tag for version `X.Y.Z` is exactly `vX.Y.Z`.

AlphaFun follows SemVer while it is pre-1.0:

- `0.y.z` patch releases contain compatible bug fixes, documentation, and
  internal changes. They must not remove or incompatibly alter a user-facing
  behavior.
- `0.y.0` minor releases may add features and may contain breaking behavior.
  Any such behavior must be called out under `Breaking` in the changelog.
- After `1.0.0`, incompatible public behavior increments the major version.

For this client application, breaking behavior includes an incompatible change
to navigation or controls, keyboard or accessible semantics, speech or
recording permissions, supported browsers, or a persisted/public data format.

## Current `0.1.0` status

The canonical repository currently has no `v0.1.0` tag or GitHub release.
The decision is that `0.1.0` remains unreleased until this process change is
merged; the tag and release must be created from the merged commit, not from
this pull-request branch.

1. After merging, update the changelog heading from `Unreleased` to the actual
   UTC release date in the merge commit.
2. Create the `v0.1.0` tag on that exact merged commit, then create the GitHub
   release from the tag. Do not create a second tag if one has been created.
3. If a tag is created at the wrong commit, do not force-move it. Use a
   maintainer-approved correction/retraction and record the decision in the
   GitHub release notes.

Until those post-merge steps are completed, documentation must describe
`0.1.0` as unreleased rather than as a published release.

## Release checklist

1. Open a pull request with the version bump, dated `CHANGELOG.md` entry, and
   any user-facing migration or breaking notes. Keep `package.json` and
   `pnpm-lock.yaml` consistent if package metadata changes.
2. Obtain maintainer approval and pass `pnpm check:third-party-notices`,
   `pnpm type-check`, `pnpm format:check`, `pnpm lint`, `pnpm test -- --run`,
   `pnpm build`, `pnpm check:asset-size`, and the browser/e2e checks used by CI.
3. Merge to `main`. Run `pnpm check:release` locally with
   `RELEASE_TAG=v<package.version>`; it verifies the exact tag spelling, valid
   SemVer, and dated changelog entry.
4. Create the GitHub release from that existing tag, paste the matching
   changelog section into its notes, and confirm the release targets the
   approved `main` commit. The release-validation workflow must pass.
5. Publish only after a maintainer has approved the protected `production`
   environment. The production deploy workflow rebuilds and validates the
   tagged source before deployment; its summary and environment record are the
   audit trail.

The repository intentionally does not grant a workflow permission to create or
move tags/releases. Tag creation and publication remain an explicit,
maintainer-approved action, while `.github/workflows/release.yml` automates the
consistency gate.

## Rollback

Use the existing [deployment and rollback runbook](deployment.md). Prefer a
reviewed revert through `main`; for an urgent application rollback, enter the
full known-good commit SHA in the production workflow and obtain the protected
`production` approval. Never move a published release tag to hide a bad
deployment. Verify the deployed app, PWA, security headers, and affected user
flow, then record the incident and follow-up issue.

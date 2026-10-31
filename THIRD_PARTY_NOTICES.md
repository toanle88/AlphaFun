# Third-party notices

The MIT License in `LICENSE` applies to AlphaFun source code and the bundled
visual assets described below. It does not grant rights to the externally
sourced fonts and dependencies listed later in this file.

### Bundled visual assets

The repository contains 34 WebP learning illustrations under
`public/images/` and three PWA icon files named `public/alphafun-icon*`.
These files are original AlphaFun artwork authored in
[`scripts/generate-original-art.mjs`](scripts/generate-original-art.mjs), with
no external source artwork or downloaded character design retained in the
repository. AlphaFun contributors grant permission to copy, modify, and
redistribute these files under the MIT License; the required attribution is
**AlphaFun contributors**.

The exact file list, SHA-256 fingerprints, source declarations, and conversion
notes are recorded in [`asset-provenance.json`](asset-provenance.json). The
licensing regression test verifies that every bundled visual file has one
complete ledger entry and that its fingerprint still matches the file.

### Learning content audit

The localized labels, category definitions, color values, and shape definitions
in `src/constants/data.ts` are AlphaFun source content and are covered by the
MIT License with the rest of the source code.

The following externally sourced items are used by the application and are
not relicensed by AlphaFun's MIT License.

## Fonts

Fredoka and Nunito are loaded at runtime from Google Fonts in `index.html`.
The font files are not vendored in this repository. Both font families are
available under the SIL Open Font License, version 1.1 (OFL-1.1):

- [Fredoka](https://fonts.google.com/specimen/Fredoka)
- [Nunito](https://fonts.google.com/specimen/Nunito)
- [SIL Open Font License 1.1](https://openfontlicense.org/)

## Runtime dependencies

These direct production dependencies are resolved by `pnpm-lock.yaml` and
remain under their own licenses:

| Package          | Resolved version | License |
| ---------------- | ---------------: | ------- |
| `clsx`           |            2.1.1 | MIT     |
| `lucide-react`   |          0.428.0 | ISC     |
| `react`          |           18.3.1 | MIT     |
| `react-dom`      |           18.3.1 | MIT     |
| `tailwind-merge` |            2.6.1 | MIT     |

The Lucide icons used by the application are provided by `lucide-react` and
are covered by its ISC license. The package's license text is available in
the package distribution and in the [Lucide repository](https://github.com/lucide-icons/lucide).

Development-only dependencies are not shipped as part of the application
runtime. Any future dependency or vendored asset should be added to this file
when it requires attribution or carries license terms beyond the MIT License.

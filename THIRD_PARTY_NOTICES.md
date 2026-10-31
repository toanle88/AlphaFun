# Third-party notices

The MIT License in `LICENSE` applies to AlphaFun source code and other files
for which AlphaFun has the right to grant that license. It does not grant
rights to the bundled visual assets listed below.

### Assets with unresolved provenance

The repository contains 34 WebP learning illustrations under
`public/images/` and three PWA icon files named `public/alphafun-icon*`.
No creator, source, permission, or license record for these files was found
in the repository, so their ownership and redistribution rights cannot be verified
from the available evidence. They are excluded from AlphaFun's MIT license
and must not be copied, redistributed, or relicensed until provenance and
compatible permission are established. Publication of these files as part of a
public release requires that follow-up.

### Learning content audit

The localized labels, category definitions, color values, and shape definitions
in `src/constants/data.ts` were reviewed. No third-party source, attribution,
or license metadata for this learning content was found in the repository. This
absence does not establish ownership or MIT compatibility; maintainers must
confirm that the content is original or add provenance and compatible licensing
before publication if any portion came from an external source.

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

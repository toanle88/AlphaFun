# Image optimization record

The baseline was measured before the migration with `find public/images -maxdepth 1 -type f -printf '%s\n' | awk '{ total += $1 } END { print total }'`.

| Asset set                         | Files |      Bytes |   MiB |
| --------------------------------- | ----: | ---------: | ----: |
| Before: all `public/images` files |    36 | 26,150,920 | 24.94 |
| Before: referenced learning files |    34 | 25,388,322 | 24.21 |
| After: referenced learning files  |    34 |  1,707,830 |  1.63 |
| After: all `public/images` files  |    34 |  1,707,830 |  1.63 |

The referenced set is 93.3% smaller. All 34 learning images are now 512px-wide
WebP files at quality 90. The 14 action illustrations retain transparency, and
`cry` retains its 2:3 aspect ratio. The duplicate, unreferenced `car.png` and
`dog.png` files were removed, along with all superseded JPEG and PNG sources.

All referenced image URLs match the explicit WebP-only Workbox glob in both Vite
config files, so the installed service worker precaches the complete learning set
for offline use without admitting legacy JPG/PNG files. The unused Vite starter
SVG was also removed from `public/`, keeping it out of the app-shell precache.

The 34 WebP files and the three PWA icons are original AlphaFun artwork released
under the MIT License with attribution to AlphaFun contributors. Their exact
SHA-256 fingerprints and the WebP/PNG conversion notes are maintained in
[`asset-provenance.json`](../asset-provenance.json); the licensing test checks
that the ledger and bundled files stay in sync.

The display mounts one learning image at a time, so each image is the current
card rather than an offscreen candidate. Images therefore remain eager and use
high fetch priority for fast first-card rendering; there are no non-critical
image elements in this view to lazy-load.

The production build generated 34 image precache URLs:

```text
/images/apple.webp /images/ball.webp /images/banana.webp /images/bird.webp
/images/book.webp /images/car.webp /images/cat.webp /images/chair.webp
/images/clap.webp /images/cry.webp /images/dance.webp /images/dog.webp
/images/drink.webp /images/eat.webp /images/fish.webp /images/flower.webp
/images/hat.webp /images/house.webp /images/jump.webp /images/laugh.webp
/images/moon.webp /images/orange.webp /images/rabbit.webp /images/read.webp
/images/run.webp /images/sing.webp /images/sleep.webp /images/star.webp
/images/sun.webp /images/swim.webp /images/table.webp /images/tree.webp
/images/walk.webp /images/write.webp
```

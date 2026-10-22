# Product listing gallery

Home, store, category, collection, search and related-product previews share the
same ProductPreview. The gallery uses 3 columns on desktop, 2 on tablet and 1 on
phones, with a 4:3 image area and `object-fit: contain` to keep furniture intact.
Reduced motion disables entrance/hover transitions; original purchase links and
single-variant quick add remain available.

The 135 catalogue products use locally hosted original photographs, rather than
the old 480px thumbnails. 254 original files were downloaded without resizing or
recompression from the existing catalogue's first two source image URLs. Covers
have native widths from 900 to 1920px. The second photograph is preferred when
its resolution is sufficient; a wider original is preferred over a smaller one.

`storefront/src/lib/data/garden-product-media.json` records the chosen order,
native dimensions and file sizes by product handle. Update this mapping when
replacing catalogue photography. Rebuild from the captured source URLs using:

    python3 storefront/scripts/download-garden-collection-images.py

Images use lazy loading and an alternate photo on devices with hover. Failed
photos advance to the next candidate; unknown/new products retain their own
Medusa gallery and thumbnail. The live database, prices and inventory are not
modified. A duplicate crossed-out price is suppressed when there is no discount.

Validation: TypeScript, lint, production build, 11 catalogue/locale/media tests;
local browser checks at desktop and 390px including Arabic RTL. Screenshots are
local previews, not evidence of a completed Railway deployment.

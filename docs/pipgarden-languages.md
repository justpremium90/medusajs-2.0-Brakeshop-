# Pip Garden languages

Public routes use `/tr`, `/en`, and `/ar`. Middleware rewrites each language to
`/[locale]/tr/...`; the internal `countryCode` remains `tr`. Language selection
never creates a region, changes currency or shipping, or replaces the cart cookie.
Legacy Turkish product/category URLs retain the same visible paths and handles.

`src/lib/i18n/messages.json` in the storefront contains explicit `[tr, en, ar]`
translations. `T` renders translated text during React rendering; it adds no DOM
wrapper and performs no text mutation or external translation request.
`I18nElement` preserves native controls and translates their accessible labels.
Underlying option values, variant IDs, prices and quantities are unchanged.
The locale provider follows route params for client navigation; server metadata
reads the locale and public path forwarded by middleware.

The captured 135-product catalogue has translations for titles, descriptions,
materials, options and technical specifications. Keep model names as proper names.
When adding or editing products, add their new source strings to the dictionary,
then run `node storefront/scripts/build-catalog-search.cjs` from the repository
root. English/Arabic searches resolve to original handles, which Medusa filters
by the same sales channel and category scope as Turkish products.

Arabic uses `dir=rtl` and the locally hosted Noto Sans Arabic font (OFL license
included alongside the font). Canonical and hreflang links are language-specific;
the sitemap lists all three languages. Company details and policy placeholders
remain the existing Lorem ipsum content.

Validation:

- `node --test storefront/qa/i18n.test.cjs storefront/qa/garden-category-seo.test.cjs`
- Storefront TypeScript, lint and production build.
- Browser: locale switching, same cart/TRY total, AR option selection, address
  submission retaining `/ar`, translated search results, canonical/hreflang,
  and mobile RTL layouts at 390px and 320px.

Local checkout tests use a separate fixture backend; they do not create live orders.
The existing production password protection remains enabled.

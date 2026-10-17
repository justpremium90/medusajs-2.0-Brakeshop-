# Brakeshop design transfer

Source: `justpremium90/brakeshoprepo`, commit `df15921c1ba39c0fed252c7b394ad46c2d230310`.
Target: `justpremium90/medusajs-2.0-Brakeshop-`, branch `codex/brakeshop-design-transfer`.

The presentation code and local assets come directly from the source repository. This is a source-code migration, not a recreation from screenshots.

## Transferred

- Responsive header, vehicle-brand rail, desktop mega menu, mobile drawer and cart dropdown.
- Full-screen video carousel, search panel and homepage product rail.
- Product cards, catalogue/category/collection layouts, product detail and gallery, product actions and cart presentation.
- Footer, brand directory, company/help/legal pages, local logos, fonts and optimized media.

## Adaptations

- Kept the target's Medusa SDK, authentication, cart actions, payment integrations and dependency versions.
- Preserved country-prefixed target routes. Source Turkish aliases resolve to target routes. Vehicle shortcuts search the target catalogue; model menus use actual target categories.
- Removed source-specific category ID consolidation and model-year mappings. No products, customer data or backend modules were imported.
- Homepage uses up to ten actual target products rather than source-managed best-seller IDs. Source-managed hero settings are represented by three local repo media slides, with their orientation corrected. These defaults can be edited in `storefront/src/modules/home/components/managed-hero/slides.json`.
- Catalogue/product layouts default to the source performance theme. Optional source listing/footer settings endpoints retain their source fallbacks when absent in target.
- Live search suggestions use the target Medusa product API. Results retain existing Meilisearch when configured and use Medusa when no search key is configured.
- Source's hardcoded product rating/new badge was removed. The source BRAKE5 banner is hidden unless `NEXT_PUBLIC_BRAKESHOP_BANK_DISCOUNT_ENABLED=true`; configure the actual discount in the target backend before enabling it.
- Static video, font and modern image requests bypass regional redirects after the existing password check.

## Validation and limits

- TypeScript checked separately with `tsc --noEmit --incremental false` because the target Next config skips build-time type validation.
- Production compilation/prerender checked against a temporary local Medusa fixture. No real backend credentials were available in this checkout.
- Local browser checks cover desktop/mobile homepage, mobile menu and catalogue, product detail, search and add-to-cart. Test products are supplied only by the external temporary fixture, not committed in the storefront.
- Real inventory, discounts, category hierarchy, shipping, checkout and payment still require validation against the target deployment.
- The source footer newsletter form has no subscription integration. Source-managed content/admin controls, account/checkout redesign and source backend features are outside this presentation transfer.
- Release target: Railway `keen-analysis / production`, Storefront service `d3dcdd27-caaa-4485-bebd-f4a984f766e5`, domain `pipgarden.com`. Existing `master` auto-deploy and production environment settings are retained.

# Pip Garden garden catalogue

Source: https://www.kafkasgarden.com, captured 17 October 2026 from rendered public product and category pages. Selling prices are copied exactly in TRY, excluding the optional source bank-transfer discount. Source ownership and reuse were confirmed by the user.

135 unique products, 10 categories, 147 local product images. Full source gallery URLs are retained. `backend/data/kafkasgarden-catalog.json` contains the catalogue, categories, original SKU, source URLs, capture timestamps, selling prices, option values and specification rows. Source category assignments are preserved, including products in multiple categories. `docs/kafkasgarden-catalog-report.json` identifies source title/material discrepancies, which have not been silently corrected. 15 source descriptions lack specification tables; these have no invented dimensions.

The existing dark header, photographic hero, condensed typography and red accents are retained. Vehicle branding, fitment search and brake copy have been replaced on the active garden pages. Contact/legal identity fields use the requested Lorem ipsum placeholders. The WhatsApp component remains hidden until a real telephone number is configured. General legal documents are placeholders and must be finalized before sales.

## Medusa import

From `backend`, with the normal backend database environment:

```sh
pnpm catalog:garden
```

This prints a read-only plan. To create the missing products and categories:

```sh
GARDEN_IMPORT_APPLY=true GARDEN_ASSET_ORIGIN=https://pipgarden.com pnpm catalog:garden
```

Deploy the storefront assets first, or use the preview storefront origin. Import uses Medusa core workflows. Re-running skips existing product handles; existing products, orders, currencies, stock, shipping and payments are never reset. Partial imports can be resumed.

Products are created as drafts with managed inventory and no allocated stock. No source quantity is public. Option combinations are draft candidates and use the captured base selling price; source variant combinations and price changes have not been verified. Original option values are preserved in metadata. Confirm them and assign inventory before publishing. Review the 30 title/material warnings in the report. Confirm the existing store has a TRY region containing TR, supported TRY currency and the intended tax, shipping and payment setup. The script reports a missing region without inventing rates or payment providers.

A catalogue snapshot is not a live price/stock synchronization. Import requires an authenticated backend environment or Admin session; no credentials are included in the repo. The current live site retains its existing basic authentication.

## Admin CSV alternative

`pnpm exec ts-node --swc src/scripts/export-garden-csv.ts /private/tmp/pipgarden-drafts.csv` produces a CSV validated by the installed Medusa CSV normalizer. Supply `GARDEN_IMPORT_MAPPING` as a JSON file with `categories` (handle → existing category ID), `salesChannelId`, and optionally `shippingProfileId` to preserve associations. Product fields appear once per product, keeping the file small. Never upload the same create-only CSV twice after success; export existing product/variant IDs for updates instead.

In the compiled Railway backend, the optional command uses `medusa exec ./src/scripts/import-garden-catalog.js` from `.medusa/server`; the build copies the catalogue JSON into that server.

For a browsable catalogue with ordering unavailable, explicitly set `GARDEN_IMPORT_STATUS=published`. Inventory remains managed, backorders remain disabled and no stock is allocated. The default remains draft. The frontend labels unverified stock as pending rather than claiming the supplier is sold out. `GARDEN_IMPORT_ON_START=true` optionally runs the import on hosted startup; use `GARDEN_IMPORT_APPLY=true`, `GARDEN_ASSET_ORIGIN` and, if the store lacks a default, `GARDEN_SALES_CHANNEL_ID`. Disable the startup flag after success.

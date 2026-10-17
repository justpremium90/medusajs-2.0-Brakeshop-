import type { LoaderOptions } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import importGardenCatalog from "../scripts/import-garden-catalog";

// Optional one-time import on a hosted backend where no shell is available.
// Disabled by default. Existing handles are skipped on subsequent restarts.
export default async function loadGardenCatalog({ container }: LoaderOptions) {
  if (process.env.GARDEN_IMPORT_ON_START !== "true") return;
  try {
    await importGardenCatalog({ container, args: [] });
  } catch (error) {
    // An optional catalogue operation must not take the existing shop offline.
    container
      .resolve(ContainerRegistrationKeys.LOGGER)
      .error(
        "Garden catalogue import failed; existing shop remains available.",
        error
      );
  }
}

const { spawnSync } = require("node:child_process");
const path = require("node:path");

// Project-level loaders are not discovered by Medusa 2. Invoke the supported
// CLI after initialization and before starting the production HTTP server.
if (process.env.GARDEN_IMPORT_ON_START === "true") {
  const result = spawnSync("medusa", ["exec", "./src/scripts/import-garden-catalog.js"], {
    cwd: path.resolve(process.cwd(), ".medusa/server"),
    env: process.env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error || result.status !== 0) {
    console.error("Garden catalogue import did not complete. The existing shop will still start.");
  }
}

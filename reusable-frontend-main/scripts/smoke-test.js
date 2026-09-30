const fs = require("node:fs");
const path = require("node:path");

const required = [
  "src/app/layout.tsx",
  "src/shared/api/client.ts",
  "src/shared/api/endpoints.ts",
  "src/shared/config/env.ts",
  "src/modules/auth/index.ts",
  "src/modules/users/index.ts",
  "src/modules/roles/index.ts",
  "src/modules/notifications/index.ts",
  "src/modules/media/index.ts",
  "src/modules/payments/index.ts",
  "src/modules/dashboard/index.ts",
  "src/modules/settings/index.ts",
  "src/modules/audit-logs/index.ts",
  "src/modules/_template/index.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("Smoke test failed:");
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log(`Smoke test passed: ${required.length} core frontend files are present.`);

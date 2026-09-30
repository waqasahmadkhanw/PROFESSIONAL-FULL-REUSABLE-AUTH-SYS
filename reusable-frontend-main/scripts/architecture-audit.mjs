import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve("src");
const files = [];

async function walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
}
await walk(root);

const violations = [];
for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  const rel = path.relative(process.cwd(), file);

  // UI and feature pages may depend on their feature modules; only the
  // shared UI layer is forbidden from importing domain modules.
  if (rel.startsWith("src/shared/") && !rel.startsWith("src/shared/store/")) {
    if (/from\s+["']@\/modules\//.test(source)) violations.push(`${rel}: shared layer imports a domain module`);
  }

  // Domain modules must not bypass the API abstraction from components/pages.
  if (/src[\\/]modules[\\/]/.test(file) && !/src[\\/]modules[\\/][^\\/]+[\\/]api[\\/]/.test(file)) {
    if (/from\s+["'](?:@\/)?(?:shared\/)?api\/(?:axios|client)/.test(source)) {
      violations.push(`${rel}: non-API layer imports the HTTP client directly`);
    }
  }
}

if (violations.length) {
  console.error("Architecture violations:");
  for (const item of violations) console.error(item);
  process.exit(1);
}

console.log(`Architecture audit passed: ${files.length} TypeScript files scanned.`);

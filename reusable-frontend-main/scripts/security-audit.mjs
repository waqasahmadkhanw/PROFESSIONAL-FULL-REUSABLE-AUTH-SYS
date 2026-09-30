import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
}

walk(root);

const violations = [];
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const relative = path.relative(process.cwd(), file).replaceAll(path.sep, "/");

  if (/localStorage\.(getItem|setItem|removeItem)\([^)]*(accessToken|refreshToken)/i.test(text)) {
    violations.push(`${relative}: browser token storage detected`);
  }

  if (/import\s+axios\s+from\s+["']axios["']/.test(text) && !relative.startsWith("src/shared/api/")) {
    violations.push(`${relative}: feature/domain code imports Axios directly`);
  }

  if (/console\.(log|info|warn|error|debug)\s*\(/.test(text)) {
    const allowed = relative === "src/core/logging/logger.ts" || relative === "src/shared/store/middleware.ts";
    if (!allowed) violations.push(`${relative}: raw console usage outside approved logging boundary`);
  }
}

const provider = fs.readFileSync(path.join(root, "shared/providers/AppProvider.tsx"), "utf8");
if (/from\s+["']@\/modules\//.test(provider)) {
  violations.push("src/shared/providers/AppProvider.tsx: shared provider imports a feature module");
}

const permissions = fs.readFileSync(path.join(root, "shared/constants/permissions.ts"), "utf8");
if (!permissions.includes('MANAGE_ACTIVITY_LOGS: "manage_activity_logs"')) {
  violations.push("permissions: manage_activity_logs is missing");
}

const config = fs.readFileSync(path.resolve("next.config.ts"), "utf8");
for (const header of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) {
  if (!config.includes(header)) violations.push(`next.config.ts: ${header} missing`);
}
if (!config.includes("poweredByHeader: false")) violations.push("next.config.ts: poweredByHeader is enabled");

if (violations.length) {
  console.error("Frontend security audit failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Frontend security audit passed: ${files.length} TypeScript files scanned.`);

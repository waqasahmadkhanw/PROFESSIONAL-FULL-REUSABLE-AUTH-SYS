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

const text = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const failures = [];
const required = [
  ["Canonical error envelope", /statusCode:\s*number[\s\S]*success:\s*false[\s\S]*data:\s*null/],
  ["Request correlation", /X-Request-Id/],
  ["CSRF protection", /X-CSRF-Token/],
  ["Payment idempotency", /Idempotency-Key/],
  ["Activity-log privilege", /MANAGE_ACTIVITY_LOGS/],
  ["Backend file signatures", /detectMime/],
  ["Mutation retry disabled", /mutations:\s*\{[\s\S]*retry:\s*0/],
];
for (const [label, pattern] of required) {
  if (!pattern.test(text)) failures.push(label);
}

if (/localStorage\.setItem\([^\n]*(accessToken|refreshToken)/.test(text) || /sessionStorage\.setItem\([^\n]*(accessToken|refreshToken)/.test(text)) {
  failures.push("No browser token persistence");
}

if (failures.length) {
  console.error("Backend alignment audit failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Backend alignment audit passed: ${files.length} TypeScript files scanned.`);

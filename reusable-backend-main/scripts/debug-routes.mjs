import fs from "fs";
import path from "path";
const routesDir = "src/routes";
const file = "settings.routes.js";
const source = fs.readFileSync(path.join(routesDir, file), "utf8");

// Match both router.route() and router\n  .route() patterns
console.log("--- Match all route patterns ---");
const routeRegex = /router\s*\.\s*route\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
for (const match of source.matchAll(routeRegex)) {
  console.log("Route:", match[1], "at index:", match.index);
}

// Now try to match from each route to the next
const routes = [...source.matchAll(routeRegex)];
for (let i = 0; i < routes.length; i++) {
  const route = routes[i][1];
  const start = routes[i].index + routes[i][0].length;
  const end = i + 1 < routes.length ? routes[i + 1].index : source.indexOf("export default");
  const chunk = source.substring(start, end);
  console.log(`\n--- Route: ${route} ---`);
  console.log("Chunk (first 300):", chunk.substring(0, 300));
  const methods = [...chunk.matchAll(/\.(get|post|put|patch|delete|head|options)\s*\(/g)];
  for (const m of methods) {
    console.log("  Method:", m[1]);
  }
}

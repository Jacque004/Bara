import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** GitHub Pages : servir l’SPA sur les routes client (/mot-de-passe, /app, …). */
const dist = resolve(process.cwd(), "dist");
const indexHtml = resolve(dist, "index.html");
const notFoundHtml = resolve(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.error("dist/index.html introuvable — lancez d’abord vite build.");
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log("Created dist/404.html for GitHub Pages SPA fallback.");

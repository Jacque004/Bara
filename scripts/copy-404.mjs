import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * GitHub Pages (project site) ne réécrit pas les routes SPA.
 * On duplique index.html pour chaque chemin connu + 404.html.
 */
const dist = resolve(process.cwd(), "dist");
const indexHtml = resolve(dist, "index.html");

const spaRoutes = [
  "connexion",
  "inscription",
  "mot-de-passe",
  "reinitialiser-mot-de-passe",
  "apropos",
  "app",
  "app/matieres",
  "app/taches",
  "app/planning",
  "app/focus",
  "app/analytics",
  "app/profil",
];

if (!existsSync(indexHtml)) {
  console.error("dist/index.html introuvable — lancez d’abord vite build.");
  process.exit(1);
}

copyFileSync(indexHtml, resolve(dist, "404.html"));
console.log("Created dist/404.html");

for (const route of spaRoutes) {
  const target = resolve(dist, route, "index.html");
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(indexHtml, target);
  console.log(`Created dist/${route}/index.html`);
}

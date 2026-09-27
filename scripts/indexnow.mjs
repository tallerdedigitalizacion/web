// Avisa a los buscadores compatibles con IndexNow (Bing, Yandex, Seznam…) de las páginas nuevas o cambiadas.
//
// Uso: node scripts/indexnow.mjs <carpeta-publicada-anterior> <carpeta-nueva>
//   Compara el HTML de cada URL del sitemap nuevo con la versión publicada y envía solo las que cambian.
//   DRY_RUN=1 muestra las URLs sin enviarlas. INDEXNOW_ALL=1 envía todas las URLs del sitemap (uso puntual).
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [previousDir, nextDir] = process.argv.slice(2);
if (!previousDir || !nextDir) {
  console.error("Uso: node scripts/indexnow.mjs <anterior> <nueva>");
  process.exit(1);
}

const keyFile = readdirSync(nextDir).find((name) => /^[a-f0-9]{32}\.txt$/.test(name));
if (!keyFile) {
  console.error("No se encontró el archivo de clave IndexNow (<32 hex>.txt) en la raíz publicada.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const sitemapPath = join(nextDir, "sitemap-0.xml");
const sitemapUrls = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const host = new URL(sitemapUrls[0]).host;

const htmlPathFor = (dir, url) => join(dir, decodeURIComponent(new URL(url).pathname), "index.html");
const digest = (file) => (existsSync(file) ? createHash("sha256").update(readFileSync(file)).digest("hex") : null);

const changed = process.env.INDEXNOW_ALL
  ? sitemapUrls
  : sitemapUrls.filter((url) => digest(htmlPathFor(nextDir, url)) !== digest(htmlPathFor(previousDir, url)));

if (changed.length === 0) {
  console.log("IndexNow: no hay páginas nuevas ni cambiadas.");
  process.exit(0);
}

console.log(`IndexNow: ${changed.length} URL(s) nuevas o cambiadas:\n${changed.join("\n")}`);
if (process.env.DRY_RUN) process.exit(0);

// La clave debe ser accesible antes de enviar: espera a que GitHub Pages publique el despliegue.
const keyLocation = `https://${host}/${keyFile}`;
for (let attempt = 1; ; attempt += 1) {
  const response = await fetch(`${keyLocation}?t=${Date.now()}`).catch(() => null);
  if (response?.ok && (await response.text()).trim() === key) break;
  if (attempt >= 20) {
    console.error(`IndexNow: la clave no está publicada en ${keyLocation}; no se envía nada.`);
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 15000));
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: changed }),
});

// 200 = recibido; 202 = recibido, clave pendiente de validar.
console.log(`IndexNow: respuesta ${response.status} ${response.statusText}`);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

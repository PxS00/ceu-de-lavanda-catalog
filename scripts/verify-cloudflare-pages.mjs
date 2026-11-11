import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import products from "../src/features/catalog/data/products.json" with { type: "json" };

const [origin, mode = "local"] = process.argv.slice(2);
if (!origin || !["local", "preview"].includes(mode)) {
  throw new Error("Uso: node scripts/verify-cloudflare-pages.mjs <origin> <local|preview>");
}
const base = new URL(origin);
if (mode === "preview") {
  assert.equal(base.protocol, "https:", "Previews precisam usar HTTPS");
  assert.match(base.hostname, /^[a-z0-9-]+\.ceu-de-lavanda\.pages\.dev$/, "Use um preview isolado, nunca a produção");
}

async function request(path) {
  const url = new URL(path, base);
  for (let attempt = 0; attempt < 15; attempt++) {
    try {
      const response = await fetch(url, { headers: { "accept-encoding": "br, gzip" } });
      if (response.ok) return response;
      if (attempt === 14) throw new Error(url.toString() + " retornou " + response.status);
    } catch (error) {
      if (attempt === 14) throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Falha ao verificar " + path);
}
const homeResponse = await request("/");
const home = await homeResponse.text();
const inspectedPages = [];
for (const path of ["/", "/catalogo/", "/produtos/acquare/"]) {
  const response = path === "/" ? homeResponse : await request(path);
  const html = path === "/" ? home : await response.text();
  const canonicalTag = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/i)?.[0] ?? "";
  const canonical = canonicalTag.match(/\bhref="([^"]+)"/i)?.[1];
  assert(canonical, "Canonical ausente: " + path);
  const canonicalUrl = new URL(canonical);
  assert.equal(canonicalUrl.protocol, "https:", "Canonical não HTTPS: " + path);
  assert.equal(canonicalUrl.pathname, path, "Canonical aponta para outra rota: " + path);
  const routeHeader = response.headers.get("x-robots-tag") ?? "";
  if (mode === "preview") {
    assert.notEqual(canonicalUrl.hostname, base.hostname, "Canonical aponta para a prévia: " + path);
    assert.match(html, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*noindex)/i, "Meta noindex ausente: " + path);
    assert.match(routeHeader, /\bnoindex\b/i, "Header noindex ausente: " + path);
    assert.match(routeHeader, /\bnoarchive\b/i, "Regras customizadas de _headers ausentes: " + path);
  }
  inspectedPages.push({ path, status: response.status, canonical, xRobotsTag: routeHeader });
}
const sitemapResponse = await request("/sitemap.xml");
const sitemap = await sitemapResponse.text();
assert.match(home, /<title>[^<]*Céu de Lavanda/i, "Título institucional não encontrado");
if (mode === "preview" || process.env.CATALOG_INDEXABLE !== "true") {
  assert.match(home, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*noindex)/i, "Build sem meta noindex");
} else {
  assert.match(home, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="index)/i, "Build de produção sem index");
}
assert.match(sitemap, /<urlset\b/i, "Sitemap inválido");
assert.match(sitemap, /\/catalogo\/perfumes\//, "Categoria de perfumes cadastrados ausente");
const categorySlugs = ["perfumes", "body-splash", "perfume-capilar"];
const emptyCategories = categorySlugs.filter((slug) => !products.some((product) => product.category === slug));
for (const slug of categorySlugs) {
  const url = "/catalogo/" + slug + "/";
  assert.equal(sitemap.includes(url), !emptyCategories.includes(slug), "Sitemap incompatível com o catálogo: " + slug);
}
for (const slug of emptyCategories) {
  const response = await request("/catalogo/" + slug + "/");
  const html = await response.text();
  assert.match(html, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*noindex)/i, "Categoria vazia indexável: " + slug);
  if (mode === "preview") assert.match(response.headers.get("x-robots-tag") ?? "", /\bnoindex\b/i, "Header noindex ausente na categoria vazia: " + slug);
}
const robotsResponse = await request("/robots.txt");
assert.match(await robotsResponse.text(), /Sitemap:\s*https:\/\//i);

const missingResponse = await fetch(new URL("/rota-inexistente-verificacao-404/", base));
assert.equal(missingResponse.status, 404, "Rota inexistente deve retornar HTTP 404");
const missingHtml = await missingResponse.text();
assert.match(missingHtml, /<title>Página não encontrada \| Céu de Lavanda<\/title>/i);
assert.match(missingHtml, /página não foi encontrada/i);
assert.doesNotMatch(missingHtml, /<link\b[^>]*\brel="canonical"/i);
assert.doesNotMatch(missingHtml, /<meta\b[^>]*(?:property="og:|name="twitter:)/i);
assert.match(missingHtml, /<meta\b(?=[^>]*\bname="robots")(?=[^>]*\bcontent="[^"]*noindex)/i);
if (mode === "preview") assert.match(missingResponse.headers.get("x-robots-tag") ?? "", /\bnoindex\b/i);

const header = homeResponse.headers.get("x-robots-tag") ?? "";
if (mode === "preview") {
  assert.match(header, /\bnoindex\b/i, "Preview sem X-Robots-Tag noindex");
  assert.match(header, /\bnoarchive\b/i, "Regras específicas de public/_headers não aplicadas");
}
const optimizedPath = "/products/generated/acquare-w400.webp";
const optimizedWidePath = "/products/generated/acquare-w800.webp";
const optimizedResponse = await request(optimizedPath);
const optimizedWideResponse = await request(optimizedWidePath);
const originalResponse = await request("/products/acquare.webp");
const optimizedBytes = (await optimizedResponse.arrayBuffer()).byteLength;
const optimizedWideBytes = (await optimizedWideResponse.arrayBuffer()).byteLength;
const originalBytes = (await originalResponse.arrayBuffer()).byteLength;
for (const [response, width] of [[optimizedResponse, 400], [optimizedWideResponse, 800]]) {
  assert.match(response.headers.get("content-type") ?? "", /image\/webp/, "Variante " + width + "px não é WebP");
}
assert(optimizedBytes < originalBytes, "Variante de 400px não economiza bytes");
assert(optimizedWideBytes < originalBytes, "Variante de 800px não economiza bytes");

const jsPath = home.match(/src="(\/_next\/static\/[^"]+\.js)"/)?.[1];
let jsAsset = null;
if (jsPath) {
  const res = await request(jsPath);
  jsAsset = {
    path: jsPath,
    contentType: res.headers.get("content-type"),
    contentEncoding: res.headers.get("content-encoding") ?? "none",
    cacheControl: res.headers.get("cache-control") ?? "none",
  };
}
if (mode === "preview") {
  assert(jsAsset, "Não foi possível identificar um arquivo JavaScript para auditar compressão");
  assert.match(jsAsset.contentEncoding, /^(br|gzip)$/i, "Cloudflare Pages não entregou JavaScript comprimido");
}

const report = {
  mode,
  origin: base.origin,
  homeStatus: homeResponse.status,
  sitemapStatus: sitemapResponse.status,
  missingStatus: missingResponse.status,
  inspectedPages,
  noindexHeader: header || "(not applicable on localhost)",
  emptyCategories,
  jsAsset,
  responsivePhoto: { originalBytes, variants: [{ path: optimizedPath, bytes: optimizedBytes }, { path: optimizedWidePath, bytes: optimizedWideBytes }] },
};
await mkdir("artifacts/quality", { recursive: true });
await writeFile("artifacts/quality/cloudflare-" + mode + ".json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

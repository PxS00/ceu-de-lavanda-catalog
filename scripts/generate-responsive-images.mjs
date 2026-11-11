import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import products from "../src/features/catalog/data/products.json" with { type: "json" };

// Deterministic build-time image variants for static Cloudflare Pages export.
// Generated binary assets are intentionally not committed.
const photographs = [...new Set(products.map((p) => p.photo?.src).filter(Boolean))];
const sources = [
  ...photographs.map((src) => ({ src, widths: [400, 800], quality: 79 })),
  { src: "/campaigns/ceu-de-lavanda-hero.webp", widths: [540, 960], quality: 81 },
];
const queue = [...sources];
const results = [];
async function worker() {
  while (queue.length) {
    const source = queue.shift();
    if (!source) break;
    const relative = source.src.slice(1);
    const input = join("public", relative);
    const outputDir = join("public", dirname(relative), "generated");
    const name = basename(relative).replace(/\.webp$/i, "");
    const meta = await sharp(input).metadata();
    if (!meta.width || meta.width < Math.max(...source.widths)) {
      throw new Error("Imagem insuficiente para geração: " + input + " (" + meta.width + ")");
    }
    await mkdir(outputDir, { recursive: true });
    const original = (await stat(input)).size;
    const variants = [];
    for (const width of source.widths) {
      const output = join(outputDir, name + "-w" + width + ".webp");
      await sharp(input).rotate().resize({ width, withoutEnlargement: true })
        .webp({ quality: source.quality, effort: 4 }).toFile(output);
      const bytes = (await stat(output)).size;
      variants.push({ width, bytes, path: output });
    }
    results.push({ src: source.src, originalBytes: original, variants });
  }
}
await Promise.all(Array.from({ length: 4 }, () => worker()));
results.sort((a, b) => a.src.localeCompare(b.src));
const report = {
  generatedAt: new Date().toISOString(),
  photos: photographs.length,
  generatedFiles: results.reduce((sum, item) => sum + item.variants.length, 0),
  originalBytes: results.reduce((sum, item) => sum + item.originalBytes, 0),
  lowResolutionBytes: results.reduce((sum, item) => sum + item.variants[0].bytes, 0),
  highResolutionBytes: results.reduce((sum, item) => sum + item.variants[1].bytes, 0),
  biggestSources: [...results].sort((a, b) => b.originalBytes - a.originalBytes).slice(0, 5),
};
await mkdir("artifacts/quality", { recursive: true });
await writeFile("artifacts/quality/responsive-images.json", JSON.stringify(report, null, 2) + "\n");
console.log("Responsive assets: " + report.generatedFiles + " variants; original total " +
 report.originalBytes + "B, low variants " + report.lowResolutionBytes + "B, high variants " + report.highResolutionBytes + "B");

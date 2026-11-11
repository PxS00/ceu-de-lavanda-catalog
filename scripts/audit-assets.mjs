import { readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const dirs = ["public/products", "public/campaigns"];
const files = [];
for (const dir of dirs) {
  for (const name of await readdir(dir)) {
    if (!/\.(webp|avif|jpe?g|png)$/i.test(name)) continue;
    const filename = join(dir, name);
    files.push({ path: filename, bytes: (await stat(filename)).size });
  }
}
files.sort((a, b) => b.bytes - a.bytes);
const report = {
  generatedAt: new Date().toISOString(),
  count: files.length,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
  largest: files.slice(0, 12),
  above350Kb: files.filter((file) => file.bytes > 350 * 1024),
};
await mkdir("artifacts/quality", { recursive: true });
await writeFile("artifacts/quality/assets.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Lab metrics only. Keep localhost (uncompressed) separate from the real CDN.
const sources = [
  { dir: "artifacts/lighthouse", environment: "local-uncompressed" },
  { dir: "artifacts/lighthouse-cloudflare", environment: "cloudflare-preview" },
];
function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const center = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[center] : (sorted[center - 1] + sorted[center]) / 2;
}
function round(value, places = 1) {
  return value == null ? null : Number(value.toFixed(places));
}
function resourceBytes(audits, type) {
  const items = audits["resource-summary"]?.details?.items ?? [];
  return items.find((item) => item.resourceType === type)?.transferSize ?? null;
}
function collect(result, environment) {
  const audits = result.audits ?? {};
  const url = result.finalDisplayedUrl ?? result.finalUrl;
  if (!url) throw new Error("Lighthouse report without URL");
  const metric = (id) => audits[id]?.numericValue ?? null;
  return {
    environment,
    route: new URL(url).pathname,
    lighthouseVersion: result.lighthouseVersion,
    performance: round((result.categories?.performance?.score ?? 0) * 100),
    accessibility: round((result.categories?.accessibility?.score ?? 0) * 100),
    bestPractices: round((result.categories?.["best-practices"]?.score ?? 0) * 100),
    seo: round((result.categories?.seo?.score ?? 0) * 100),
    lcpMs: metric("largest-contentful-paint"),
    cls: metric("cumulative-layout-shift"),
    tbtMs: metric("total-blocking-time"),
    fcpMs: metric("first-contentful-paint"),
    transferBytes: resourceBytes(audits, "total"),
    scriptBytes: resourceBytes(audits, "script"),
    cssBytes: resourceBytes(audits, "stylesheet"),
    fontBytes: resourceBytes(audits, "font"),
    unusedJsSavingsBytes: audits["unused-javascript"]?.details?.overallSavingsBytes ?? null,
    fontDisplayScore: audits["font-display"]?.score ?? null,
    lcpSelector: audits["largest-contentful-paint-element"]?.details?.items?.[0]?.node?.selector ?? null,
  };
}
const readings = [];
for (const { dir, environment } of sources) {
  let files;
  try {
    files = (await readdir(dir)).filter((file) => file.endsWith(".report.json")).sort();
  } catch (error) {
    if (error?.code === "ENOENT") continue;
    throw error;
  }
  for (const file of files) {
    const result = JSON.parse(await readFile(join(dir, file), "utf8"));
    readings.push({ ...collect(result, environment), reportFile: join(dir, file) });
  }
}
const groups = Map.groupBy
  ? Map.groupBy(readings, (entry) => entry.environment + " " + entry.route)
  : readings.reduce((map, entry) => {
      const key = entry.environment + " " + entry.route;
      map.set(key, [...(map.get(key) ?? []), entry]);
      return map;
    }, new Map());
const fields = [
  "performance", "accessibility", "bestPractices", "seo", "lcpMs", "cls",
  "tbtMs", "fcpMs", "transferBytes", "scriptBytes", "cssBytes",
  "fontBytes", "unusedJsSavingsBytes",
];
const rows = [...groups.values()].map((entries) => {
  const first = entries[0];
  const values = Object.fromEntries(fields.map((field) => [
    field, round(median(entries.map((entry) => entry[field])), field === "cls" ? 4 : 1),
  ]));
  return {
    environment: first.environment,
    route: first.route,
    runs: entries.length,
    lcpSelector: first.lcpSelector,
    fontDisplayScore: first.fontDisplayScore,
    ...values,
    lcpRangeMs: [round(Math.min(...entries.map((entry) => entry.lcpMs))), round(Math.max(...entries.map((entry) => entry.lcpMs)))],
    performanceRange: [Math.min(...entries.map((entry) => entry.performance)), Math.max(...entries.map((entry) => entry.performance))],
  };
}).sort((a, b) => (a.environment + a.route).localeCompare(b.environment + b.route));
const result = {
  generatedAt: new Date().toISOString(),
  note: "Lighthouse simulated mobile lab metrics, not real-user Core Web Vitals. Local Python server lacks Brotli.",
  rows,
  readings,
};
const fmt = (value, suffix = "") => value == null ? "—" : String(value) + suffix;
const markdown = [
  "# Lighthouse CI — medians by route and environment",
  "",
  "Simulation only. CDN and localhost are not interchangeable; INP is not measured.",
  "",
  "| Environment | Route | Runs | Perf. | LCP (ms) | CLS | TBT (ms) | JS transferred (KiB) | Fonts (KiB) | Unused JS estimate (KiB) |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...rows.map((row) => "| " + [
    row.environment, row.route, row.runs, fmt(row.performance),
    fmt(row.lcpMs == null ? null : Math.round(row.lcpMs)),
    fmt(row.cls), fmt(row.tbtMs == null ? null : Math.round(row.tbtMs)),
    fmt(row.scriptBytes == null ? null : round(row.scriptBytes / 1024)),
    fmt(row.fontBytes == null ? null : round(row.fontBytes / 1024)),
    fmt(row.unusedJsSavingsBytes == null ? null : round(row.unusedJsSavingsBytes / 1024)),
  ].join(" | ") + " |"),
  "",
].join("\n");
await mkdir("artifacts/quality", { recursive: true });
await Promise.all([
  writeFile("artifacts/quality/lighthouse-summary.json", JSON.stringify(result, null, 2) + "\n"),
  writeFile("artifacts/quality/lighthouse-summary.md", markdown),
]);
console.log(markdown);

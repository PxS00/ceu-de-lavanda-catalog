import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const css = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const tokens = Object.fromEntries(
  [...css.slice(0, css.indexOf("\n}")).matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
    ([, key, value]) => [key, value.trim()],
  ),
);
function color(token) {
  const value = tokens[token];
  assert.ok(value, `Missing token: ${token}`);
  const reference = value.match(/^var\((--[\w-]+)\)$/);
  return reference ? color(reference[1]) : value;
}
function luminance(hex) {
  const [r, g, b] = hex.match(/[\da-f]{2}/gi).map((pair) => {
    const channel = parseInt(pair, 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}
function contrast(foreground, background) {
  const values = [
    luminance(color(foreground)),
    luminance(color(background)),
  ].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("the seven official palette values are preserved", () => {
  const palette = {
    "--color-gold": "#BD8C40",
    "--color-gold-light": "#EDCC8A",
    "--color-ink": "#3B3836",
    "--color-warm": "#EAC8A9",
    "--color-paper": "#FFF8EE",
    "--color-lavender": "#BEAAD4",
    "--color-lavender-light": "#D9C9E8",
  };
  for (const [token, value] of Object.entries(palette)) {
    assert.equal(color(token).toUpperCase(), value);
    assert.ok(
      css.includes(`var(${token})`),
      `${token} must have a semantic role`,
    );
  }
});

test("text and active actions meet WCAG AA contrast on their actual surfaces", () => {
  for (const [foreground, background] of [
    ["--foreground", "--background"],
    ["--muted", "--background"],
    ["--foreground", "--surface-warm"],
    ["--foreground", "--surface-accent"],
    ["--foreground", "--surface-highlight"],
    ["--action-foreground", "--action-background"],
    ["--foreground", "--action-hover"],
    ["--selected-foreground", "--selected-background"],
  ]) {
    assert.ok(
      contrast(foreground, background) >= 4.5,
      `${foreground} on ${background}`,
    );
  }
  assert.ok(contrast("--control-border", "--background") >= 3);
  for (const surface of [
    "--background",
    "--surface-warm",
    "--surface-accent",
    "--selected-background",
  ]) {
    assert.ok(contrast("--focus-ring", surface) >= 3);
  }
});

test("official SVG assets remain byte-identical to the supplied originals", () => {
  const hashes = {
    "public/brand/emblem.svg":
      "cffd7c849f6919a1a1bc1714d2733224707f55b530b8220704ffc0208fd60a50",
    "public/brand/emblem-ink.svg":
      "4c1d4138cf8a86c43f5aba9d55370dbc5883d5743433fdd64e86fcf3b640cf70",
    "public/brand/wordmark-gold.svg":
      "82c148dd7e2f331226ebf8c1b5c143a9ff5f932136fe44e5a2f0d8da37e3c4d6",
    "src/app/icon.svg":
      "cffd7c849f6919a1a1bc1714d2733224707f55b530b8220704ffc0208fd60a50",
  };
  for (const [path, expected] of Object.entries(hashes)) {
    const bytes = readFileSync(new URL(`../${path}`, import.meta.url));
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      expected,
      path,
    );
  }
});

test("unverified font binaries are not publicly bundled", () => {
  assert.equal(
    existsSync(
      new URL("../public/fonts/ivy-presto-display.otf", import.meta.url),
    ),
    false,
  );
  assert.doesNotMatch(css, /@font-face|url\([^)]*\.(?:otf|ttf|woff2?)\b/);
});

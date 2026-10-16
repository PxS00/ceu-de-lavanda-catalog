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
    ["--text-accent", "--background"],
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
    "public/branding/ceu-de-lavanda-monogram-graphite.svg":
      "7113ef59217680862c948d98447be542ed9c2bef223be87090c4e109889931e2",
    "public/branding/ceu-de-lavanda-logo-graphite.svg":
      "86f059376890e4f06a091a3d745736b5039b97a6c5ce76b3596aa0f004dea3c3",
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

test("gold ornaments preserve the botanical paths of the official artwork", () => {
  const source = readFileSync(
    new URL("../public/brand/emblem-ink.svg", import.meta.url),
    "utf8",
  );
  const ornament = readFileSync(
    new URL("../public/branding/lavender-ornament-gold.svg", import.meta.url),
    "utf8",
  );
  const paths = (svg) =>
    [...svg.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(paths(ornament), paths(source).slice(0, 3));
  assert.match(ornament, /fill="#BD8C40"/);
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

test("local substitute fonts ship with their OFL licenses", () => {
  const fonts = {
    "cormorant-garamond":
      "8048ac209bec741e1c29cd0cfac5aac1c0c2ba8c3ddbd4a58fa9bd92ef5c63c2",
    "pinyon-script":
      "3e1f69a201572cad4aabea7ccf720f093a7dbc005380b2a1b89e0b94476d3e42",
  };
  for (const [family, hash] of Object.entries(fonts)) {
    const file = readFileSync(
      new URL(`../src/app/fonts/${family}-latin.woff2`, import.meta.url),
    );
    assert.equal(createHash("sha256").update(file).digest("hex"), hash);
    const license = readFileSync(
      new URL(`../public/branding/licenses/${family}-OFL.txt`, import.meta.url),
      "utf8",
    );
    assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.match(license, /Copyright/);
  }
});

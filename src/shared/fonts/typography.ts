import localFont from "next/font/local";

// OFL alternatives; replace only after obtaining licensed official webfonts.
export const editorial = localFont({
  src: "./cormorant-garamond-latin.woff2",
  variable: "--font-editorial",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
});

export const decorative = localFont({
  src: "./pinyon-script-latin.woff2",
  variable: "--font-script",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

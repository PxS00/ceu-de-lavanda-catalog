import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { syntheticProducts } from "./products.mjs";

// Build a disposable copy so fixtures can never enter the production export.
const directory = mkdtempSync(resolve(tmpdir(), "lavanda-scalability-"));
process.on("exit", () => rmSync(directory, { recursive: true, force: true }));
symlinkSync(resolve("node_modules"), resolve(directory, "node_modules"), "dir");
for (const path of ["src", "public", "package.json", "tsconfig.json", "next.config.ts"])
  cpSync(path, resolve(directory, path), { recursive: true });
writeFileSync(resolve(directory, "src/data/products.json"), JSON.stringify(syntheticProducts));
mkdirSync(resolve(directory, "public/products"), { recursive: true });
writeFileSync(resolve(directory, "public/products/motion-test.png"), Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=", "base64"));
execFileSync(process.execPath, ["node_modules/next/dist/bin/next", "build", directory, "--webpack"], { stdio: "inherit" });
const server = spawn("python3", ["-m", "http.server", "4174", "--bind", "127.0.0.1", "--directory", resolve(directory, "out")], { stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.kill(signal));
server.on("error", (error) => { throw error; });
server.on("exit", (code) => process.exit(code ?? 1));

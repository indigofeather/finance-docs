#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.argv[2] ?? "out";
const maxWidth = Number.parseInt(process.env.STATIC_IMAGE_MAX_WIDTH ?? "600", 10);
const quality = Number.parseInt(process.env.STATIC_IMAGE_QUALITY ?? "5", 10);
const removeRscPayloads = process.env.REMOVE_NEXT_RSC_TXT === "1";

function walk(dir) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(path));
    if (entry.isFile()) results.push(path);
  }

  return results;
}

function hasFfmpeg() {
  const result = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return result.status === 0;
}

function optimizeJpeg(path) {
  const before = statSync(path).size;
  const temp = `${path}.tmp.jpg`;
  const scale = `scale='if(gt(iw,${maxWidth}),${maxWidth},iw)':-2`;
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      path,
      "-vf",
      scale,
      "-q:v",
      String(quality),
      temp,
    ],
    { encoding: "utf8" },
  );

  if (result.status !== 0 || !existsSync(temp)) {
    if (existsSync(temp)) unlinkSync(temp);
    return { changed: false, before, after: before, error: result.stderr?.trim() };
  }

  const after = statSync(temp).size;
  if (after < before) {
    renameSync(temp, path);
    return { changed: true, before, after };
  }

  unlinkSync(temp);
  return { changed: false, before, after: before };
}

function formatMiB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

if (!existsSync(root)) {
  console.log(`[optimize-static-output] ${root}/ does not exist, skipping`);
  process.exit(0);
}

const files = walk(root);
const imageTargets = files.filter((path) => {
  const ext = extname(path).toLowerCase();
  return ext === ".jpg" || ext === ".jpeg";
});

let changed = 0;
let saved = 0;
let failed = 0;

if (imageTargets.length > 0) {
  if (!hasFfmpeg()) {
    console.warn("[optimize-static-output] ffmpeg not found; skipping JPEG optimization");
  } else {
    for (const image of imageTargets) {
      const result = optimizeJpeg(image);
      if (result.error) {
        failed += 1;
        console.warn(`[optimize-static-output] failed: ${image}: ${result.error}`);
        continue;
      }
      if (result.changed) {
        changed += 1;
        saved += result.before - result.after;
      }
    }
  }
}

let removedTxt = 0;
let removedTxtBytes = 0;
if (removeRscPayloads) {
  for (const file of files) {
    if (extname(file).toLowerCase() !== ".txt") continue;
    const size = statSync(file).size;
    unlinkSync(file);
    removedTxt += 1;
    removedTxtBytes += size;
  }
}

console.log(
  `[optimize-static-output] JPEGs: ${changed}/${imageTargets.length} optimized, saved ${formatMiB(saved)}, failed ${failed}`,
);

if (removeRscPayloads) {
  console.log(
    `[optimize-static-output] RSC .txt payloads removed: ${removedTxt}, saved ${formatMiB(removedTxtBytes)}`,
  );
}

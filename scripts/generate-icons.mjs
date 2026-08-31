import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);

const src = path.join(publicDir, "logo_v1.png");
const BG = { r: 26, g: 21, b: 15 }; // #1a150f

function createFrom(outFile, size, { containRatio = 0.8 } = {}) {
  const buffer = sharp(src)
    .resize({ width: size, height: size, fit: "contain", background: BG })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return buffer.then((b) =>
    sharp(b).png({ compressionLevel: 9 }).toFile(outFile),
  );
}

const jobs = [
  ["apple-touch-icon-180x180.png", 180],
  ["pwa-64x64.png", 64],
  ["pwa-192x192.png", 192],
  ["pwa-512x512.png", 512],
  ["maskable-icon-192x192.png", 192],
  ["maskable-icon-512x512.png", 512],
];

for (const [name, size] of jobs) {
  await createFrom(path.join(publicDir, name), size);
}

console.log("done");

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public",
);

const src = path.join(publicDir, "icon_v1.png");
const BG = { r: 26, g: 21, b: 15 }; // #1a150f

function createFrom(outFile, size, { containRatio = 0.8 } = {}) {
  const buffer = sharp(src)
    .resize({
      width: Math.round(size * containRatio),
      height: Math.round(size * containRatio),
      fit: "contain",
      background: BG,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
  return buffer.then((b) =>
    sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: BG,
      },
    })
      .composite([{ input: b, gravity: "centre" }])
      .png({ compressionLevel: 9 })
      .toFile(outFile),
  );
}

const jobs = [
  ["apple-touch-icon-180x180.png", 180, { containRatio: 1 }],
  ["pwa-64x64.png", 64, { containRatio: 1 }],
  ["pwa-192x192.png", 192, { containRatio: 1 }],
  ["pwa-512x512.png", 512, { containRatio: 1 }],
  ["maskable-icon-192x192.png", 192, { containRatio: 0.8 }],
  ["maskable-icon-512x512.png", 512, { containRatio: 0.8 }],
  ["favicon-64x64.png", 64, { containRatio: 1 }],
];

for (const [name, size, opts] of jobs) {
  await createFrom(path.join(publicDir, name), size, opts ?? {});
}

console.log("done");

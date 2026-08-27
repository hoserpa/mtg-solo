import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "minimal-2023",
  },
  preset: {
    ...minimal2023Preset,
    transparent: {
      sizes: [64, 192, 512],
      favicon: [16, 32, 48, 64],
    },
    maskable: {
      sizes: [512, 192],
    },
    apple: {
      sizes: [180],
    },
  },
  images: ["public/pwa-icon.svg"],
});

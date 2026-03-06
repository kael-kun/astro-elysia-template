// @ts-check
import { defineConfig, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "compile",
  }),

  vite: {
    plugins: [tailwindcss()],
  },
  // env: {
  //   schema: {
  //     ENV: envField.string({ context: "client", access: "public", default: "test" }),
  //     SECRET_DEV: envField.string({ context: "server", access: "secret", default: "test" }),
  //   },
  // },
});

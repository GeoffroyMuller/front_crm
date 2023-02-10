import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
  },
  environment: "jsdom",
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/core/assets/style/_variables.scss";
          @import "./src/core/assets/style/_mixins.scss";
          @import "./src/core/assets/style/_functions.scss";
          @import "./src/core/assets/style/_media_mixins.scss";
        `,
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["vue"],
  },
});

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    watch: false,
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/__tests__/**", "dist/"],
    },
  },
  esbuild: {
    target: "node14",
  },
});

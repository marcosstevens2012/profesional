"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("vitest/config");
exports.default = (0, config_1.defineConfig)({
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

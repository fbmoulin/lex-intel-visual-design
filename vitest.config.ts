import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    // Default environment for server tests
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "server/**/*.spec.ts",
      "shared/**/*.test.ts",
      "client/src/**/*.test.tsx",
      "client/src/**/*.test.ts",
    ],
    // Use jsdom environment for client tests
    environmentMatchGlobs: [
      ["client/src/**/*.test.tsx", "jsdom"],
      ["client/src/**/*.test.ts", "jsdom"],
    ],
    // Setup files for client tests
    setupFiles: ["./client/src/test/setup.ts"],
    // Globals for jest-dom matchers
    globals: true,
  },
});

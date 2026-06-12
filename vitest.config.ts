import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    fileParallelism: false,
    include: ["tests/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**", "work/**"],
    coverage: { reporter: ["text", "html"], include: ["src/lib/**/*.ts", "src/app/api/**/*.ts"] },
  },
});

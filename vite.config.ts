/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
    test: {
        globals: true,
        coverage: {
            include: ["src/**/*.ts"],
            provider: "v8",
            reportOnFailure: true,
            reporter: ["text", "html"],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90,
            },
        },
        typecheck: { enabled: true },
    },
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            fileName: () => "index.js",
        },
        sourcemap: true,
        rollupOptions: { external: ["@typescript-eslint/utils"] },
    },
    clearScreen: false,
});

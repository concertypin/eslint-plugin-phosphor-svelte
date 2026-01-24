/// <reference types="vitest/config" />
/// <reference types="node" />
import path from "path";

import { type UserConfig as RawUserConfig, defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Make all properties required and non-optional recursively
type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
type UserConfig = DeepRequired<RawUserConfig>;
const test: UserConfig["test"] = {
    globals: true,
    include: ["tests/**/*.test.ts", "tests/*.test.ts"],
    silent: "passed-only",
    environment: "node",
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
    typecheck: {
        enabled: true,
        tsconfig: "tsconfig.test.json",
        include: ["tests/**/*.test.ts", "tests/*.test.ts"],
    },
};
const alias: UserConfig["resolve"]["alias"] = {
    "@": path.resolve(__dirname, "src"),
};
export default defineConfig({
    test,
    plugins: [dts({ tsconfigPath: "./tsconfig.app.json", outDir: "dist", entryRoot: "src" })],
    resolve: { alias },
    build: {
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
            name: "eslint-plugin-phosphor-svelte",
            fileName: "index",
        },
        sourcemap: true,
        rollupOptions: { external: ["@typescript-eslint/utils"] },
    },
    clearScreen: false,
});

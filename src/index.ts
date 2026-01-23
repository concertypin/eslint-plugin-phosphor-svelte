import type { TSESLint } from "@typescript-eslint/utils";
import optimizeImports from "./rules/optimize-imports.js";

const plugin = {
    meta: {
        name: "eslint-plugin-phosphor-svelte",
        version: "0.1.0",
    },
    rules: {
        "optimize-imports": optimizeImports,
    },
    configs: {},
} satisfies TSESLint.Linter.Plugin;

plugin.configs = {
    recommended: {
        plugins: {
            "phosphor-svelte": plugin,
        },
        rules: {
            "phosphor-svelte/optimize-imports": "warn",
        },
    },
};

export default plugin;

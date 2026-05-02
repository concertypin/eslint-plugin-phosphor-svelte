import { dirname } from "path";
import { fileURLToPath } from "url";

import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
    {
        ignores: ["dist/", "coverage/", "node_modules/"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: dirname(fileURLToPath(import.meta.url)),
            },
        },
    },
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
    {
        files: ["scripts/eslint-version-matrix.ts"],
        languageOptions: {
            globals: {
                console: "readonly",
                fetch: "readonly",
            },
        },
    },
    {
        rules: {
            "prettier/prettier": "warn",
        },
    },
);

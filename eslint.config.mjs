import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";

export default defineConfig(
    {
        ignores: ["dist/", "coverage/", "node_modules/"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
    {
        rules: {
            "prettier/prettier": "warn",
        },
    },
);

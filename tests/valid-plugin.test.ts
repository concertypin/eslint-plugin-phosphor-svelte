import type { configs } from "@eslint/js";
import { defineConfig } from "eslint/config";
import { describe, expect, expectTypeOf, it } from "vitest";

import { phosphorSvelteConfig, plugin } from "@/index";

describe("valid-plugin", () => {
    it.concurrent("should have the correct plugin type", () => {
        // Good case: ESLint's config type
        expectTypeOf<typeof defineConfig>().toBeCallableWith<(typeof configs.recommended)[]>();

        // Actual test: our plugin config
        expectTypeOf<typeof defineConfig>().toBeCallableWith<(typeof phosphorSvelteConfig)[]>();
        expectTypeOf(plugin.configs.recommended).toEqualTypeOf(phosphorSvelteConfig);
    });

    it.concurrent("should have optimize-imports rule", () => {
        expect(plugin.rules).toHaveProperty("optimize-imports");
        const rule = plugin.rules?.["optimize-imports"];
        expect(rule).toBeDefined();
        expect(rule?.meta).toBeDefined();
        expect(typeof rule?.create).toBe("function");
    });
});

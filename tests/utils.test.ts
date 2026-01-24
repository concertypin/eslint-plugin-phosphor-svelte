import { describe, expect, it } from "vitest";

import { createRule } from "@/utils";

describe("utils.createRule", () => {
    it("should create a rule for a known rule name", () => {
        const ruleModule = {
            name: "optimize-imports",
            meta: {
                docs: { description: "test" },
                messages: { ok: "ok" },
                schema: [],
                type: "suggestion",
            },
            defaultOptions: [],
            create: (/* context */) => ({}),
        } as const;

        // should not throw
        expect(() => createRule(ruleModule)).not.toThrow();
    });

    it("should throw for unknown rule name", () => {
        const ruleModule = {
            name: "unknown-rule",
            meta: {
                docs: { description: "test" },
                messages: { ok: "ok" },
                schema: [],
                type: "suggestion",
            },
            defaultOptions: [],
            create: () => ({}),
        } as const;

        expect(() => createRule(ruleModule)).toThrowError(
            /No documentation URL found for rule: unknown-rule/,
        );
    });
});

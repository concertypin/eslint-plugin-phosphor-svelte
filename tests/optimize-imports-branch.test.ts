import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";
import { describe, expect, it } from "vitest";

import { rule } from "@/rules/optimize-imports";

type MessageIds = "optimizeImports" | "noDynamicImport";

describe("optimize-imports defensive guard", () => {
    it("still produces the optimized import even if a specifier changes type mid-map", () => {
        let firstAccess = true;
        const togglingSpecifier = {
            get type() {
                if (firstAccess) {
                    firstAccess = false;
                    return AST_NODE_TYPES.ImportSpecifier;
                }
                return "NotImportSpecifier";
            },
            imported: { type: AST_NODE_TYPES.Identifier, name: "HorseIcon" },
            local: { name: "HorseIcon" },
        } as unknown as TSESTree.ImportSpecifier;

        const fakeNode = {
            source: { value: "phosphor-svelte" },
            specifiers: [togglingSpecifier],
        } as unknown as TSESTree.ImportDeclaration;

        const fakeFixer: TSESLint.RuleFixer = {
            replaceText: (_node, text) => ({ range: [0, 0] as const, text }),
            insertTextAfter: () => ({ range: [0, 0] as const, text: "" }),
            insertTextAfterRange: () => ({ range: [0, 0] as const, text: "" }),
            insertTextBefore: () => ({ range: [0, 0] as const, text: "" }),
            insertTextBeforeRange: () => ({ range: [0, 0] as const, text: "" }),
            remove: () => ({ range: [0, 0] as const, text: "" }),
            removeRange: () => ({ range: [0, 0] as const, text: "" }),
            replaceTextRange: () => ({ range: [0, 0] as const, text: "" }),
        };

        let capturedFix:
            | TSESLint.RuleFix
            | readonly TSESLint.RuleFix[]
            | IterableIterator<TSESLint.RuleFix>
            | null
            | undefined;
        const fakeContext = {
            report(descriptor: TSESLint.ReportDescriptor<MessageIds>) {
                const fix = descriptor.fix;
                if (!fix) {
                    return;
                }
                if (typeof fix === "function") {
                    capturedFix = fix(fakeFixer);
                } else {
                    capturedFix = fix;
                }
            },
        } as unknown as TSESLint.RuleContext<MessageIds, []>;

        const visitor = rule.create(fakeContext);
        visitor.ImportDeclaration?.(fakeNode);

        const fixResult = capturedFix;
        expect(fixResult).toBeDefined();
        if (Array.isArray(fixResult)) {
            expect(fixResult[0]).toHaveProperty(
                "text",
                'import HorseIcon from "phosphor-svelte/lib/HorseIcon";',
            );
        } else if (fixResult && "text" in fixResult) {
            expect(fixResult).toHaveProperty(
                "text",
                'import HorseIcon from "phosphor-svelte/lib/HorseIcon";',
            );
        }
    });
});

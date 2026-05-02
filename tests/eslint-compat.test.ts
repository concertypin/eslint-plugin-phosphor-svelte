import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

import { phosphorSvelteConfig } from "@/index";

describe("eslint compatibility", () => {
    it("loads the recommended flat config through the ESLint API", async () => {
        const eslint = new ESLint({
            overrideConfig: [phosphorSvelteConfig],
            overrideConfigFile: true,
        });

        const [result] = await eslint.lintText('import { HorseIcon } from "phosphor-svelte";\n', {
            filePath: "example.js",
        });

        expect(result.messages).toHaveLength(1);
        expect(result.messages[0]).toMatchObject({
            ruleId: "phosphor-svelte/optimize-imports",
            severity: 1,
            messageId: "optimizeImports",
        });
    });
});

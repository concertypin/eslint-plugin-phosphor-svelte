import { RuleTester } from "@typescript-eslint/rule-tester";
import { describe } from "vitest";

// Import module with augmentation to ensure types are loaded
import "@/index";
import { rule } from "@/rules/optimize-imports";

const ruleTester = new RuleTester(
    // Type assertion needed because module augmentation doesn't apply in test context
    {
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module",
            },
        },
    } as unknown as ConstructorParameters<typeof RuleTester>[0],
);

describe("optimize-imports", () => {
    ruleTester.run("optimize-imports", rule, {
        valid: [
            // Already optimized imports
            'import HorseIcon from "phosphor-svelte/lib/HorseIcon";',
            'import HeartIcon from "phosphor-svelte/lib/HeartIcon";',
            // Import from other packages
            'import { Something } from "other-package";',
            // Default import (should be ignored as we don't know what it is, or maybe it is not valid for phosphor-svelte but rule shouldn't crash)
            'import Phosphor from "phosphor-svelte";',
            // Namespace import
            'import * as Phosphor from "phosphor-svelte";',
            // Side effect import (no specifiers)
            'import "phosphor-svelte";',
            // Dynamic import of other package
            'import("other-package")',
        ],
        invalid: [
            {
                code: 'import { HorseIcon } from "phosphor-svelte";',
                output: 'import HorseIcon from "phosphor-svelte/lib/HorseIcon";',
                errors: [{ messageId: "optimizeImports" }],
            },
            {
                code: 'import { HorseIcon, HeartIcon } from "phosphor-svelte";',
                output: 'import HorseIcon from "phosphor-svelte/lib/HorseIcon";\nimport HeartIcon from "phosphor-svelte/lib/HeartIcon";',
                errors: [{ messageId: "optimizeImports" }],
            },
            {
                code: 'import { HorseIcon as MyHorse } from "phosphor-svelte";',
                output: 'import MyHorse from "phosphor-svelte/lib/HorseIcon";',
                errors: [{ messageId: "optimizeImports" }],
            },
            {
                code: 'import { HorseIcon as MyHorse, HeartIcon } from "phosphor-svelte";',
                output: 'import MyHorse from "phosphor-svelte/lib/HorseIcon";\nimport HeartIcon from "phosphor-svelte/lib/HeartIcon";',
                errors: [{ messageId: "optimizeImports" }],
            },
            {
                code: 'import { "HorseIcon" as Horse } from "phosphor-svelte";',
                output: 'import Horse from "phosphor-svelte/lib/HorseIcon";',
                errors: [{ messageId: "optimizeImports" }],
            },
            {
                code: 'import("phosphor-svelte")',
                output: null,
                errors: [{ messageId: "noDynamicImport" }],
            },
        ],
    });
});

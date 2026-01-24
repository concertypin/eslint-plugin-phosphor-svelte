import { version } from "../package.json";
import type { Rule } from "eslint";
import type { Config as EslintConfig } from "eslint/config";

import { rule as optimizeImports } from "@/rules/optimize-imports";

declare module "@typescript-eslint/utils" {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace TSESLint {
        // eslint-disable-next-line @typescript-eslint/no-namespace
        export namespace FlatConfig {
            interface LanguageOptions {
                [key: string]: unknown;
            }
        }
    }
}

type EslintPlugin = NonNullable<EslintConfig["plugins"]>[string];
type PhosphorPlugin = EslintPlugin & { configs: { recommended: EslintConfig } };
type OptimizeImportsContext = Parameters<typeof optimizeImports.create>[0];

const optimizeImportsRule: Rule.RuleModule = {
    meta: optimizeImports.meta,
    /* v8 ignore next 3 */
    create(context: Rule.RuleContext): Rule.RuleListener {
        const typedContext = context as unknown as OptimizeImportsContext;
        return optimizeImports.create(typedContext) as unknown as Rule.RuleListener;
    },
};

const basePlugin: EslintPlugin = {
    meta: {
        name: "eslint-plugin-phosphor-svelte",
        version: version,
    },
    rules: {
        "optimize-imports": optimizeImportsRule,
    },
};

const phosphorSvelteConfig: EslintConfig = {
    plugins: {
        "phosphor-svelte": basePlugin,
    },
    rules: {
        "phosphor-svelte/optimize-imports": "warn",
    },
};

const plugin: PhosphorPlugin = {
    ...basePlugin,
    configs: {
        recommended: phosphorSvelteConfig,
    },
};

export { phosphorSvelteConfig, plugin };
export default plugin;

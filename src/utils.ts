import { ESLintUtils } from "@typescript-eslint/utils";

export interface ExamplePluginDocs {
    description: string;
    recommended?: boolean;
    requiresTypeChecking?: boolean;
}

const docsMap: {
    [name: string]: string;
} = {
    "optimize-imports": "https://github.com/haruaki07/phosphor-svelte",
};
export const createRule = ESLintUtils.RuleCreator<ExamplePluginDocs>((name) => {
    if (name in docsMap) {
        return docsMap[name];
    }
    throw new Error(`No documentation URL found for rule: ${name}`);
});

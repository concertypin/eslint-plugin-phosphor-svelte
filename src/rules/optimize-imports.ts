import { TSESLint, TSESTree } from "@typescript-eslint/utils";

const rule: TSESLint.RuleModule<"optimizeImports" | "noDynamicImport", []> = {
    meta: {
        type: "suggestion",
        docs: {
            description: "Optimize phosphor-svelte imports",
        },
        fixable: "code",
        schema: [],
        messages: {
            optimizeImports:
                "Import from 'phosphor-svelte' should be optimized to specific file imports.",
            noDynamicImport:
                "Dynamic import of 'phosphor-svelte' is detected. This prevents tree-shaking.",
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            ImportDeclaration(node) {
                if (node.source.value !== "phosphor-svelte") {
                    return;
                }

                // Check if there are any specifiers that are not named imports
                const hasNonNamed = node.specifiers.some((s) => s.type !== "ImportSpecifier");

                // If there are default or namespace imports, ignore.
                if (hasNonNamed) {
                    return;
                }

                if (node.specifiers.length === 0) {
                    return;
                }

                context.report({
                    node,
                    messageId: "optimizeImports",
                    fix(fixer) {
                        const newImports = node.specifiers.map((specifier) => {
                            const importSpec = specifier as TSESTree.ImportSpecifier;
                            const importedName =
                                importSpec.imported.type === "Identifier"
                                    ? importSpec.imported.name
                                    : importSpec.imported.value;
                            const localName = importSpec.local.name;

                            return `import ${localName} from "phosphor-svelte/lib/${importedName}";`;
                        });

                        return fixer.replaceText(node, newImports.join("\n"));
                    },
                });
            },
            ImportExpression(node) {
                if (node.source.type === "Literal" && node.source.value === "phosphor-svelte") {
                    context.report({
                        node,
                        messageId: "noDynamicImport",
                    });
                }
            },
        };
    },
};

export default rule;

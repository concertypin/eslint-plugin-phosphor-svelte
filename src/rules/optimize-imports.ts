import { AST_NODE_TYPES } from "@typescript-eslint/utils";

import { createRule } from "@/utils";

export const rule = createRule({
    name: "optimize-imports",
    meta: {
        type: "suggestion",
        docs: {
            requiresTypeChecking: false,
            recommended: true,
            url: "https://github.com/haruaki07/phosphor-svelte",
            description: "Avoid importing the entire 'phosphor-svelte' library.",
        },
        fixable: "code",
        schema: [],
        messages: {
            optimizeImports:
                "Import from 'phosphor-svelte' should be optimized to specific file imports.",
            noDynamicImport:
                "Dynamic import of 'phosphor-svelte' is unrecommended, since it imports the entire library and slows down auto-completion.",
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
                const hasNonNamed = node.specifiers.some(
                    (s) => s.type !== AST_NODE_TYPES.ImportSpecifier,
                );

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
                            // Type assertion is safe because hasNonNamed check ensures all are ImportSpecifiers
                            const importSpec = specifier as typeof specifier & {
                                type: AST_NODE_TYPES.ImportSpecifier;
                            };
                            const importedName =
                                importSpec.imported.type === AST_NODE_TYPES.Identifier
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
                if (
                    node.source.type === AST_NODE_TYPES.Literal &&
                    node.source.value === "phosphor-svelte"
                ) {
                    context.report({
                        node,
                        messageId: "noDynamicImport",
                    });
                }
            },
        };
    },
});

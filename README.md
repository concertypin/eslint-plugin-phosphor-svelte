# 🔌 eslint-plugin-phosphor-svelte

[![npm version](https://img.shields.io/npm/v/eslint-plugin-phosphor-svelte?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-phosphor-svelte)
[![npm downloads](https://img.shields.io/npm/dm/eslint-plugin-phosphor-svelte?style=flat-square)](https://www.npmjs.com/package/eslint-plugin-phosphor-svelte)
[![License](https://img.shields.io/npm/l/eslint-plugin-phosphor-svelte?style=flat-square)](LICENSE)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)](https://github.com/concertypin/eslint-plugin-phosphor-svelte)

> ⚡ **Supercharge your Svelte development** with blazing-fast auto-completion!

ESLint plugin that optimizes imports for [`phosphor-svelte`](https://github.com/haruaki07/phosphor-svelte) to dramatically improve IDE performance.

**The Problem:** Importing from `phosphor-svelte` shows 8,000+ icon suggestions, making your IDE slow and sluggish.

**The Solution:** This plugin automatically transforms bulk imports into individual file imports, giving you instant auto-completion and a responsive editor.

### ✨ Example Transformation

**Before:**

```ts
import { CubeIcon, HeartIcon, HorseIcon } from "phosphor-svelte";
```

When you type `import {`, your IDE shows **8,000+ icon suggestions**, making it slow and difficult to find what you need.

**After:**

```ts
import CubeIcon from "phosphor-svelte/lib/CubeIcon";
import HeartIcon from "phosphor-svelte/lib/HeartIcon";
import HorseIcon from "phosphor-svelte/lib/HorseIcon";
```

Auto-completion is now instant and only shows relevant completions. Your IDE stays responsive even in large projects!

---

## ✨ Features

- ⚡ **Lightning-fast auto-completion** - No more waiting for 8,000+ icon suggestions
- 🔧 **Auto-fix support** - Fix all imports with one command: `eslint --fix`
- 🎯 **100% test coverage** - Reliable and thoroughly tested
- 📘 **Full TypeScript support** - Complete type safety
- 🔌 **ESLint 9+ flat config** - Modern configuration style
- 🎨 **Svelte-ready** - Works seamlessly with `.svelte` files
- 🔒 **npm Trusted Publisher** - Enhanced supply chain security

---

## 📦 Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm install eslint --save-dev
# or
pnpm add -D eslint
# or
yarn add eslint --dev
```

Next, install `eslint-plugin-phosphor-svelte`:

```sh
npm install eslint-plugin-phosphor-svelte --save-dev
# or
pnpm add -D eslint-plugin-phosphor-svelte
# or
yarn add eslint-plugin-phosphor-svelte --dev
```

## 🚀 Usage

### Flat Config (ESLint 9+)

Add `eslint-plugin-phosphor-svelte` to your `eslint.config.js`:

```js
import phosphorSvelte from "eslint-plugin-phosphor-svelte";

export default [
    phosphorSvelte.configs.recommended,
    // other configs...
];
```

Or configure it manually:

```js
import phosphorSvelte from "eslint-plugin-phosphor-svelte";

export default [
    {
        plugins: {
            "phosphor-svelte": phosphorSvelte,
        },
        rules: {
            "phosphor-svelte/optimize-imports": "warn",
        },
    },
];
```

## 🎨 Usage with Svelte Projects

### Prerequisites

Make sure you have the necessary ESLint plugins for Svelte:

```sh
pnpm add -D eslint eslint-plugin-svelte typescript-eslint
```

### Complete Svelte ESLint Configuration

Here's a recommended configuration for a Svelte project with TypeScript:

```js
// eslint.config.js
import js from "@eslint/js";
import phosphorSvelte from "eslint-plugin-phosphor-svelte";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    ...svelte.configs["flat/prettier"],
    {
        plugins: {
            "phosphor-svelte": phosphorSvelte,
        },
        rules: {
            "phosphor-svelte/optimize-imports": "warn",
        },
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/"],
    },
];
```

**⚠️ Important: Use the recommended config**

It's recommended to use the plugin's recommended config instead of manually configuring rules:

```js
// ✅ Using recommended config (simpler and less error-prone)
import phosphorSvelte from 'eslint-plugin-phosphor-svelte';

export default [
  // ... other configs
  phosphorSvelte.configs.recommended,  // Use this!
  // ...
];

// ❌ Avoid this (can cause import issues)
import { phosphorSvelteConfig } from 'eslint-plugin-phosphor-svelte';
export default [
  phosphorSvelteConfig,  // This might not work properly
];
```

### Svelte Component Example

**Before:**

```svelte
<script>
  import { HeartIcon, StarIcon } from "phosphor-svelte";
</script>

<HeartIcon />
<StarIcon />
```

**After (autofixed):**

```svelte
<script>
  import HeartIcon from "phosphor-svelte/lib/HeartIcon";
  import StarIcon from "phosphor-svelte/lib/StarIcon";
</script>

<HeartIcon />
<StarIcon />
```

### Troubleshooting

#### ESLint doesn't recognize imports in Svelte files

If ESLint is not detecting imports in your `.svelte` files, check the following:

**1. Ensure TypeScript parser is configured for Svelte files:**

```js
// eslint.config.js
import js from "@eslint/js";
import phosphorSvelte from "eslint-plugin-phosphor-svelte";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

export default [
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs["flat/recommended"],
    {
        plugins: {
            "phosphor-svelte": phosphorSvelte,
        },
        rules: {
            "phosphor-svelte/optimize-imports": "warn",
        },
    },
    // ⚠️ IMPORTANT: Configure Svelte files with TypeScript parser
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser,
            },
        },
    },
    {
        ignores: ["build/", ".svelte-kit/", "dist/"],
    },
];
```

**⚠️ Common mistake: Don't split `languageOptions` across multiple configs!**

```js
// ❌ WRONG - This won't work!
[
    phosphorSvelteConfig, // Has languageOptions
    {
        languageOptions: {
            globals: { ...globals.browser },
        },
    },
    {
        files: ["**/*.svelte"],
        languageOptions: {
            parserOptions: {
                parser: ts.parser, // This won't be merged properly!
            },
        },
    },
];
```

```js
// ✅ CORRECT - Combine all languageOptions in one place
[
    {
        ...phosphorSvelteConfig,
        languageOptions: {
            ...phosphorSvelteConfig.languageOptions,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ...phosphorSvelteConfig.languageOptions?.parserOptions,
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
                extraFileExtensions: [".svelte"],
            },
        },
    },
    {
        files: ["**/*.svelte", "**/*.svelte.ts"],
        languageOptions: {
            parserOptions: {
                // Svelte files need TypeScript parser for imports to be detected
                parser: ts.parser,
            },
        },
    },
];
```

**2. Check your `package.json` dependencies:**

```json
{
    "devDependencies": {
        "@eslint/js": "^9.x.x",
        "eslint": "^9.x.x",
        "eslint-plugin-svelte": "^2.x.x",
        "eslint-plugin-phosphor-svelte": "^0.0.2",
        "typescript-eslint": "^8.x.x",
        "typescript": "^5.x.x"
    }
}
```

**3. Verify Svelte parser is installed:**

```sh
pnpm list eslint-plugin-svelte
# or
npm list eslint-plugin-svelte
```

If not installed:

```sh
pnpm add -D eslint-plugin-svelte
```

**4. Common issues and solutions:**

| Issue                                   | Solution                                                |
| --------------------------------------- | ------------------------------------------------------- |
| ESLint doesn't scan `.svelte` files     | Add `files: ['**/*.svelte']` to config                  |
| Imports in `<script>` tags not detected | Add `languageOptions.parserOptions.parser: ts.parser`   |
| VSCode ESLint extension not working     | Reload VSCode window (`Ctrl+Shift+P` → "Reload Window") |
| Type errors in Svelte files             | Ensure `svelte-check` is installed and configured       |

**5. Test your configuration:**

Create a test file `test.svelte`:

```svelte
<script>
  import { HeartIcon } from "phosphor-svelte";
</script>
```

Then run:

```sh
npx eslint test.svelte
```

You should see:

```
test.svelte
  2:3  warning  Use default imports from specific icon paths  phosphor-svelte/optimize-imports
```

## 📋 Rules

### `phosphor-svelte/optimize-imports`

Enforces the use of default imports from specific file paths for `phosphor-svelte` icons to enable tree-shaking.

**Invalid:**

```ts
import { HorseIcon } from "phosphor-svelte";
import { CubeIcon, HeartIcon } from "phosphor-svelte";
```

**Valid (Autofixed):**

```ts
import CubeIcon from "phosphor-svelte/lib/CubeIcon";
import HeartIcon from "phosphor-svelte/lib/HeartIcon";
import HorseIcon from "phosphor-svelte/lib/HorseIcon";
```

**Dynamic Imports:**

Dynamic imports are also flagged but not autofixed, as they prevent static analysis for tree-shaking.

```ts
// Warning: Dynamic import of 'phosphor-svelte' is detected.
const module = await import("phosphor-svelte");
```

### Rule Options

This rule has no options.

## 💡 Why Use This Plugin?

When you import from `phosphor-svelte` using named imports like `import { Icon } from "phosphor-svelte"`, your IDE's auto-completion shows all available icons (thousands of them). This can make your editor sluggish, especially when:

- ⌨️ Typing import statements
- 🖱️ Hovering over code
- 💡 Using IntelliSense features
- 📂 Working in large projects

This plugin transforms those imports into individual file imports, reducing the auto-completion scope and significantly improving your IDE's performance. While bundlers like Vite and webpack handle tree-shaking automatically, this plugin solves the **developer experience** problem by making your editor faster and more responsive.

### Performance Impact

Without this plugin, typing `import { ` from phosphor-svelte may show **8,000+ suggestions** in your auto-completion dropdown. With this plugin, the import is transformed to a specific file path, eliminating the performance bottleneck entirely.

## ⚙️ How It Works

1. 🔍 **Detects** named imports from `phosphor-svelte`
2. 🔄 **Transforms** them into default imports from individual icon files
3. ⚠️ **Reports** dynamic imports (manual fix required)
4. ✅ **Autofixes** static imports automatically
5. ⚡ **Result**: Your IDE shows only relevant imports, and auto-completion becomes lightning fast

The plugin uses ESLint's fixer API to apply transformations automatically when you run `eslint --fix`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Format code
pnpm format

# Lint
pnpm lint

# Run all checks
pnpm check
```

## 📄 License

Apache License 2.0 © [concertypin](https://github.com/concertypin)

---

## 🔗 Related Projects

- 🎨 [phosphor-svelte](https://github.com/haruaki07/phosphor-svelte) - The Svelte icon library this plugin optimizes
- 🎯 [phosphor-icons](https://phosphoricons.com/) - The official Phosphor Icons library
- 🔌 [eslint-plugin-phosphor](https://github.com/concertypin/eslint-plugin-phosphor) - ESLint plugin for React/Vue Phosphor Icons

---

<div align="center">

**Made with ❤️ for the Svelte community**

[⭐ Star this project](https://github.com/concertypin/eslint-plugin-phosphor-svelte) • [🐛 Report a bug](https://github.com/concertypin/eslint-plugin-phosphor-svelte/issues) • [💡 Request a feature](https://github.com/concertypin/eslint-plugin-phosphor-svelte/issues)

</div>

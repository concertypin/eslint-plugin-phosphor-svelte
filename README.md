# eslint-plugin-phosphor-svelte

ESLint plugin to optimize imports for `phosphor-svelte`.

It automatically transforms:

```ts
import { HorseIcon } from "phosphor-svelte";
```

into:

```ts
import HorseIcon from "phosphor-svelte/lib/HorseIcon";
```

This reduces bundle size by avoiding importing the entire icon library.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
pnpm add -D eslint
yarn add eslint --dev
```

Next, install `eslint-plugin-phosphor-svelte`:

```sh
npm install eslint-plugin-phosphor-svelte --save-dev
pnpm add -D eslint-plugin-phosphor-svelte
yarn add eslint-plugin-phosphor-svelte --dev
```

## Usage

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

## Rules

### `phosphor-svelte/optimize-imports`

Enforces the use of default imports from specific file paths for `phosphor-svelte` icons to enable tree-shaking.

**Invalid:**

```ts
import { HorseIcon } from "phosphor-svelte";
import { HeartIcon, CubeIcon } from "phosphor-svelte";
```

**Valid (Autofixed):**

```ts
import HorseIcon from "phosphor-svelte/lib/HorseIcon";
import HeartIcon from "phosphor-svelte/lib/HeartIcon";
import CubeIcon from "phosphor-svelte/lib/CubeIcon";
```

**Dynamic Imports:**

Dynamic imports are also flagged but not autofixed, as they prevent static analysis for tree-shaking.

```ts
// Warning: Dynamic import of 'phosphor-svelte' is detected.
const module = await import("phosphor-svelte");
```

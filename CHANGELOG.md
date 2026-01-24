# 📝 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.0.2] - 2026-01-24

### ✨ Added

- 🔧 **ESLint 9+ Flat Config Support**: Migrated to modern flat config style using `@typescript-eslint/utils` RuleCreator
- 📘 **Full TypeScript Support**: Complete type safety with `TSESLint.FlatConfig` types and module augmentation
- 🎯 **100% Test Coverage**: Comprehensive test suite covering all code paths
    - Added `tests/utils.test.ts` for `createRule` factory testing
    - Added `tests/valid-plugin.test.ts` for plugin validation
- 🔒 **npm Trusted Publisher**: Enhanced security for supply chain protection

### 🔄 Changed

- 🚀 **Improved Type Safety**: Removed all `any` types from codebase
- 📦 **Better Plugin Exports**: Properly typed as `eslint/config` compatible types
- 📚 **Enhanced Documentation**:
    - Clarified that this plugin improves **IDE auto-completion performance**, not just bundle size
    - Added comprehensive Svelte integration guide
    - Added troubleshooting section for common issues
    - Added complete configuration examples

### 🐛 Fixed

- ✅ Fixed `defineConfig` compatibility with ESLint config helpers
- ✅ Resolved module augmentation for `TSESLint.FlatConfig.LanguageOptions`
- ✅ Fixed type bridging between `typescript-eslint` and `eslint` rule types

---

## [0.0.1] - 2026-01-23

### 🎉 Initial Release

- ⚡ **Auto-Import Optimization**: Automatically transforms bulk imports into individual file imports
- 🏃 **IDE Performance**: Dramatically improves auto-completion speed (from 8,000+ suggestions to just what you need)
- 🔧 **Auto-Fix Support**: One-command fix with `eslint --fix`
- 📋 **Rule**: `phosphor-svelte/optimize-imports` - Enforces optimized imports
- 🎨 **Svelte Support**: Full support for `.svelte` files with proper parser configuration

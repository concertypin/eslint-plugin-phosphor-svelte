/// <reference types="node" />
/**
 * @fileoverview Post-install script to set up git hooks using simple-git-hooks.
 */

import { exec, spawn } from "child_process";
import { promisify } from "util";

async function simpleGitHooksSetup(): Promise<number> {
    const gitRemote = await promisify(exec)("git remote get-url origin");
    if (!gitRemote.stdout.trim().includes("eslint-plugin-phosphor-svelte")) {
        // Not the main repository, skip setting up hooks
        return 0;
    }
    const result = spawn("pnpm", ["exec", "simple-git-hooks"], {
        stdio: ["ignore", "ignore", "ignore"],
        shell: true,
    });
    return new Promise((resolve) => {
        result.on("close", (code) => {
            resolve(code ?? 0);
        });
    });
}

if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
    // No need to set up git hooks in production or CI environments.
    process.exit(0);
}

try {
    const simpleGitHooks = await simpleGitHooksSetup();
    if (simpleGitHooks !== 0) {
        process.exit(simpleGitHooks);
    }
} catch (error) {
    console.error("Failed to set up git hooks:", error);
    process.exit(1);
}

/// <reference types="node" />
import { appendFileSync } from "node:fs";
import process from "node:process";

const registryUrl = "https://registry.npmjs.org";
const minEslintVersion = "9.39.0";
const maxEslintMajor = 11;

type VersionTuple = [major: number, minor: number, patch: number];
type RegistryMetadata = {
    versions: Record<string, unknown>;
};
type MatrixEntry = {
    eslint: string;
    eslintJs: string;
    latest: boolean;
};

function parseStableVersion(version: string): VersionTuple | null {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
    if (!match) {
        return null;
    }

    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function compareVersions(a: string, b: string): number {
    const parsedA = parseStableVersion(a);
    const parsedB = parseStableVersion(b);

    if (!parsedA || !parsedB) {
        throw new Error(`Cannot compare non-stable versions: ${a}, ${b}`);
    }

    for (let i = 0; i < parsedA.length; i += 1) {
        const diff = parsedA[i] - parsedB[i];
        if (diff !== 0) {
            return diff;
        }
    }

    return 0;
}

function isSupportedEslintVersion(version: string): boolean {
    const parsed = parseStableVersion(version);
    if (!parsed) {
        return false;
    }

    const [major] = parsed;
    return major < maxEslintMajor && compareVersions(version, minEslintVersion) >= 0;
}

function isRegistryMetadata(metadata: unknown): metadata is RegistryMetadata {
    return (
        typeof metadata === "object" &&
        metadata !== null &&
        "versions" in metadata &&
        typeof metadata.versions === "object" &&
        metadata.versions !== null
    );
}

async function fetchVersions(packageName: string): Promise<string[]> {
    const response = await fetch(`${registryUrl}/${packageName}`);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${packageName}: ${response.status} ${response.statusText}`,
        );
    }

    const metadata: unknown = await response.json();
    if (!isRegistryMetadata(metadata)) {
        throw new Error(`Unexpected registry metadata for ${packageName}`);
    }

    return Object.keys(metadata.versions).filter((version) => parseStableVersion(version));
}

function latestByMinor(versions: string[]): string[] {
    const groups = new Map<string, string>();

    for (const version of versions) {
        const [major, minor] = parseStableVersion(version) as VersionTuple;
        const key = `${major}.${minor}`;
        const current = groups.get(key);

        if (!current || compareVersions(version, current) > 0) {
            groups.set(key, version);
        }
    }

    return [...groups.values()].sort(compareVersions);
}

function latestByMajor(versions: string[]): Map<number, string> {
    const groups = new Map<number, string>();

    for (const version of versions) {
        const [major] = parseStableVersion(version) as VersionTuple;
        const current = groups.get(major);

        if (!current || compareVersions(version, current) > 0) {
            groups.set(major, version);
        }
    }

    return groups;
}

const eslintVersions = (await fetchVersions("eslint")).filter(isSupportedEslintVersion);
const eslintJsVersions = latestByMajor(await fetchVersions("@eslint/js"));
const selectedEslintVersions = latestByMinor(eslintVersions);
const latestEslintVersion = selectedEslintVersions.at(-1);

const matrix = {
    include: selectedEslintVersions.map<MatrixEntry>((eslintVersion) => {
        const [eslintMajor] = parseStableVersion(eslintVersion) as VersionTuple;
        const eslintJsVersion = eslintJsVersions.get(eslintMajor);

        if (!eslintJsVersion) {
            throw new Error(`No @eslint/js version found for ESLint ${eslintVersion}`);
        }

        return {
            eslint: eslintVersion,
            eslintJs: eslintJsVersion,
            latest: eslintVersion === latestEslintVersion,
        };
    }),
};

const matrixJson = JSON.stringify(matrix);
console.log(matrixJson);

if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${matrixJson}\n`);
}

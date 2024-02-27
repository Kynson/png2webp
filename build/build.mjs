import { readdir, readFile, writeFile, unlink, rename } from 'node:fs/promises';
import { execSync } from 'node:child_process';

import { build } from 'esbuild';
import { nodeJsShimPlugin } from './nodeJsShimPlugin.mjs';

const pkgPath = new URL('../pkg', import.meta.url).pathname;

function logInfo(message) {
  console.log(`\x1b[90m\x1b[1m[INFO]:\x1b[0m ${message}`);
}

logInfo('Cleaning old build files...');

const oldBuildFiles = await readdir(pkgPath);
await Promise.all(
  oldBuildFiles
    .filter((file) => /^png2webp.*$/.test(file))
    .map((file) => unlink(`${pkgPath}/${file}`))
);

const entryPointPath = `${pkgPath}/png2webp.js`;
const outFilePath = `${pkgPath}/png2webp.min.mjs`;
const typeDefinitionPath = `${pkgPath}/png2webp.d.ts`;
const packageJsonPath = `${pkgPath}/package.json`;

logInfo('Building WASM binary...');

execSync('wasm-pack build --target web', { stdio: 'inherit' });

logInfo('Building JS binding...');

await build({
  entryPoints: [entryPointPath],
  minify: true,
  format: 'esm',
  target: 'esnext',
  outfile: outFilePath,
  plugins: [nodeJsShimPlugin]
});

await unlink(`${pkgPath}/png2webp.js`);

logInfo('Updating type definition file...');

await rename(typeDefinitionPath, typeDefinitionPath.replace(/\.d\.ts$/, '.min.d.mts'));

logInfo('Updating package.json...');

const packageJsonContent = JSON.parse(await readFile(packageJsonPath, 'utf-8'));

packageJsonContent.module = 'png2webp.min.mjs';
packageJsonContent.types = 'png2webp.min.d.mts';
packageJsonContent.files = [
  'png2webp.min.mjs',
  'png2webp.min.d.mts',
  'png2webp_bg.wasm'
];
// Delete the generated collaborators & sideEffects fields
delete packageJsonContent.collaborators;
delete packageJsonContent.sideEffects;
packageJsonContent.author = 'Kynson Szetau (https://kynsonszetau.com/)';

await writeFile(
  packageJsonPath,
  JSON.stringify(packageJsonContent, null, 2)
);

logInfo('Done!');

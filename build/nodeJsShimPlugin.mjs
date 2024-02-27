import { readFile } from 'node:fs/promises';

const NODE_JS_SHIM = `
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    const { readFile } = await import('node:fs/promises');
    input = readFile(input);
  }
  $&
`;

export const nodeJsShimPlugin = {
  name: 'wasm',
  /**
   * @param { import('esbuild').PluginBuild } build 
   */
  setup(build) {
    build.onLoad({ filter: /png2webp\.js$/ }, async (args) => {
      let contents = await readFile(args.path, 'utf8');

      contents = contents.replace(
        /(?<=^async function __wbg_init[\s\S]*)^\s*const imports = __wbg_get_imports\(\);$/gm,
        NODE_JS_SHIM
      )

      return {
        contents,
        loader: 'js'
      }
    });
  }
}
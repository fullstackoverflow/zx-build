import * as esbuild from 'esbuild'
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module'

const input = 'zx/src/cli.ts';
const tmp_input = 'zx/src/___cli.ts';
const output = 'dist/zx.mjs';

const input_content = await readFile(input, 'utf-8');

let pattern = /await import\(globals\)/g;
let replacement = 'await import("./globals.js")';

let fixed_content = input_content.replace(pattern, replacement);

await writeFile(tmp_input, fixed_content);

await esbuild.build({
    entryPoints: [tmp_input],
    bundle: true,
    outfile: output,
    format: "esm",
    target: "esnext",
    platform: "node",
    banner: {
        js: `
import { createRequire as topLevelCreateRequire } from 'module';
const require = topLevelCreateRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if(getVersion()){
    getVersion = function(){
        return "${createRequire(import.meta.url)('./zx/package.json').version}";
    }
}
        `
    },
})

await unlink(tmp_input);
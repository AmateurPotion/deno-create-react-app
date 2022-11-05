import { emptyDir, ensureFile, walk } from "std/fs/mod.ts";
import { join } from "std/path/mod.ts";

import {bundleIndexJs} from "dcra/build/bundle.ts"
import {ensureProject} from "dcra/util.ts";

const buildFolder = 'dist/build'
const mainJsOutput = 'dist/build/static/js/main.js'

export async function build() {
  ensureProject()

  console.log(`cleaning build dir: ${buildFolder}`)
  await emptyDir(buildFolder)

  console.log(`bundling index.tsx`)
  await bundleIndexJs(mainJsOutput)

  const targetIndexHTML = join(buildFolder, 'index.html');
  console.log(`copying index.html -> ${targetIndexHTML}`)
  await ensureFile(targetIndexHTML)
  await Deno.copyFile('index.html', targetIndexHTML)

  for await (const f of walk('static', {includeDirs: false})) {
    const targetPath = join(buildFolder, f.path);
    console.log(`copying ${f.path} -> ${targetPath}`)
    await ensureFile(targetPath)
    await Deno.copyFile(f.path, targetPath)
  }
  console.log(`build done. see '${buildFolder}'`)
}
import { exists, ensureDir, ensureFile } from "std/fs/mod.ts";
import { join } from "std/path/mod.ts";
import resources from "dcra/init/template/generated/mod.ts"

export async function initProject(folder: string, name: string) {
  const root = join(folder, name)
  if (await exists(root)) {
    console.error(`directory exist, please delete it first: ${root}`)
    return null
  }
  console.log('generating...')
  await ensureDir(root)
  for (const resource of resources) {
    const fp = join(root, resource.path)
    await ensureFile(fp)
    await Deno.writeFile(fp, resource.content)
  }
  console.log('done.')
}
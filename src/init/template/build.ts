import { walk } from "std/fs/mod.ts";
import { dirname, fromFileUrl, join, relative } from "std/path/mod.ts";

const templatePath = dirname(fromFileUrl(import.meta.url))
const p = Deno.run({
  cmd: [
    'deno', 'run', '--allow-read', '--allow-write', '--unstable',
    'https://deno.land/x/deno_static@v1.1.0/mod.ts',
    'resources', 'generated',
    '-o',
  ],
  stdout: "inherit",
  stderr: "inherit",
  cwd: templatePath
})

const status = await p.status()

if (!status.success) {
  Deno.exit(status.code)
}

const resourcesPath = join(templatePath, 'resources');
const generatedModPath = join(templatePath, 'generated', 'mod.ts')

console.log(`generate mod.ts ${generatedModPath}`)

const imports = []
const values = []

for await (const f of walk(resourcesPath, {includeDirs: false})) {
  const rel = relative(resourcesPath, f.path).replace(/\\/g, '/')
  const name = rel.replace(/\W/g, '_')

  imports.push(`import ${name} from './${rel}.static.ts'`)
  values.push(`  {
    path:'${rel}',
    content: ${name}
  },`)
}

await Deno.writeTextFile(generatedModPath, `${imports.join('\n')}\n\nexport default [\n${values.join('\n')}\n]`)

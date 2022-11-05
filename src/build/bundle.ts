import {ensureFile} from 'std/fs/mod.ts'

export async function bundleIndexJs(output:string) {
  await ensureFile(output)
  const res = await Deno.run({
    cmd: [
      'deno', 'bundle',
      '--config', 'deno.jsonc',
      'index.tsx', output
    ]
  })
  return (await res.status()).success
}
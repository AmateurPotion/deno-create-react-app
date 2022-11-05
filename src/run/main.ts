import { Router, send, Application, helpers, isHttpError } from "oak/mod.ts"
import { open } from "opener/mod.ts";
import {bundleIndexJs} from "dcra/build/bundle.ts";
import {ensureProject} from "dcra/util.ts";

const bundleOutput = 'dist/run/static/js/main.js'

export async function run(options: { port: number, watch: boolean }) {
  ensureProject()
  console.log("bundling 'index.tsx'");
  if (!await bundleIndexJs(bundleOutput)) {
    console.error(`fail to bundle 'index.tsx', exit`)
    return null
  }
  console.log('bundle succeed')
  if (options.watch) {
    watch()
  }
  await runServer(options.port)
}

export async function watch() {
  let handler = undefined
  for await (const event of Deno.watchFs('.')) {
    if (["create", "modify", "remove"].some(s => s == event.kind) &&
      event.paths.some((p: string) => p.endsWith('tsx') || p.endsWith('ts'))) {
      clearTimeout(handler)
      handler = setTimeout(async () => {
        console.log('file changed, re-bundling...')
        if (await bundleIndexJs(bundleOutput)) {
          console.log('bundle succeed')
        } else {
          console.error(`fail to bundle 'index.tsx', exit`)
        }
      }, 500)
    }
  }
}

export function runServer(port: number) {
  const router = new Router();
  router
    .get('/ping', ctx => {
      ctx.response.body = 'pong'
    })
    .get('/', async ctx => {
      await send(ctx, 'index.html');
    })
    .get('/static/js/main.js', async ctx => {
      await send(ctx, bundleOutput);
    })
    .get('/static/:path(.*)', async ctx => {
      await send(ctx, ctx.request.url.pathname);
    })

  const app = new Application();
  app.use(async (ctx, next) => {
    const query = helpers.getQuery(ctx)
    try {
      await next();
    } catch (err) {
      if (isHttpError(err)) {
        ctx.response.body = {
          code: err.status,
          message: err.message,
          stack: query.trace == undefined ? undefined : err.stack,
        }
        ctx.response.status = err.status
      } else {
        throw err;
      }
    }
  })
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener('listen', ({hostname, port, secure}) => {
    const url = `${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`
    console.log(`Listening on: ${url}`,);
    open(url)
  });

  return app.listen({port: port});
}
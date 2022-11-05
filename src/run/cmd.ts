import {Command} from "cliffy/command/mod.ts";
import {run} from "dcra/run/main.ts";

export const runCommand = new Command()
  .description("run project")
  .allowEmpty()
  .option('-p, --port <port:number>', 'server port number', {default: 8000})
  .option('-w, --watch [watch:boolean]', 'watch file change to reload', {default: true})
  .action(async option => {
    await run(option)
  });

import {Command} from "cliffy/command/mod.ts";
import {initProject} from "dcra/init/main.ts";

export const initCommand = new Command()
  .description("init deno-create-react-app project")
  .arguments('<name:string>')
  .action(async (_options, name: string) => {
    await initProject(Deno.cwd(), name)
  });



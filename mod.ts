import {cli} from "./deps.ts";
import { runCommand } from "dcra/mod.ts";
//import * as init from "./init/cmd.ts";
//import * as build from "./build/cmd.ts";

// deno-lint-ignore no-unused-vars
const { options } = await new cli.Command()
  .name("deno-create-react-app")
  .version("0.1.2")
  .description("Create React App with Deno")
  .command("run", runCommand)
  .parse(Deno.args);

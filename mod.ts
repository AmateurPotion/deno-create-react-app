import {cli} from "./deps.ts";
import { runCommand, initCommand, buildCommand } from "dcra/mod.ts";

// deno-lint-ignore no-unused-vars
const { options } = await new cli.Command()
  .name("deno-create-react-app")
  .version("0.1.2")
  .description("Create React App with Deno")
  .command("init", initCommand)
  .command("run", runCommand)
  .command("build", buildCommand)
  .parse(Deno.args);

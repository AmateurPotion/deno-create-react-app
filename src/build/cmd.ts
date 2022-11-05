import { Command } from "cliffy/command/mod.ts";
import {build} from "dcra/build/main.ts";

export const buildCommand = new Command()
  .description("build project")
  .allowEmpty()
  .action(build);



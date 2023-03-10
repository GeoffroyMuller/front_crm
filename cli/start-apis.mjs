import chalk from "chalk";
import {
  listPackages,
  print,
  runCommand,
} from "./utils.mjs";


listPackages().forEach((folder) => {
  if (folder.startsWith("api_")) {
    const child = runCommand("yarn dev", folder);
    child.on("close", (code) => {
      print(chalk.yellow(`child process exited with code ${code}`));
    });
  }
});

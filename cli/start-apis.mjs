import chalk from "chalk";
import { exec } from "child_process";
import {
  listPackages,
  print,
  error,
  stderr,
  stdout,
} from "./utils.mjs";

const close = (code) =>
  print(chalk.yellow(`child process exited with code ${code}`));

listPackages().forEach((folder) => {
  if (folder.startsWith("api_")) {
    const childProcess = exec(`cd ./packages/${folder} & yarn dev`);
    childProcess.stdout.on("data", (data) => stdout(data, folder));
    childProcess.stderr.on("data", (data) => stderr(data, folder));
    childProcess.on("error", error);
    childProcess.on("close", close);
  }
});

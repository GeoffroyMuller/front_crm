import chalk from "chalk";
import { exec, spawn } from "child_process";
import * as fs from "fs";
import path from "path";


const folderColored = folder => chalk.bgGrey(`[${folder}]`) + ':'

const print = console.log;
const stdout = (data, folder) => print(`${folderColored(folder)}${data}`);
const stderr = (data, folder) => print(`${folderColored(folder)}${data}`);
const error = (data) => print(chalk.red(`error: ${data.message}`));
const close = (code) =>
  print(chalk.yellow(`child process exited with code ${code}`));

fs.readdir(path.join("packages"), (err, foldersNames) => {
  if (!err) {
    foldersNames.forEach((folder) => {
        if (folder.startsWith("api_")) {
            const childProcess = exec(`cd ./packages/${folder} & yarn dev`);
            childProcess.stdout.on("data", data => stdout(data, folder));
            childProcess.stderr.on("data", data => stderr(data, folder));
            childProcess.on("error", error);
            childProcess.on("close", close);
        }
    });
  }
});



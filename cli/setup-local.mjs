import chalk from "chalk";
import { exec } from "child_process";
import * as fs from "fs";
import path from "path";
import {
  listPackages,
  print,
  getPackageJson,
  error,
  stderr,
  stdout,
} from "./utils.mjs";

const packages = listPackages();

function copyEnvSampleInEnv() {
  for (const folder of packages) {
    const envPath = path.join("packages", folder, ".env");
    const envSamplePath = path.join("packages", folder, ".env.sample");
    if (fs.existsSync(envSamplePath)) {
      fs.copyFileSync(envSamplePath, envPath);
      print(chalk.blue(`Copied ${envSamplePath} to ${envPath}`));
    }
  }
}

async function migrate() {
  for (const folder of packages) {
    const packageJson = getPackageJson(folder);
    if (packageJson.scripts.migrate) {
      const childProcess = exec(`cd ./packages/${folder} & yarn migrate`);
      childProcess.stdout.on("data", (data) => stdout(data, folder));
      childProcess.stderr.on("data", (data) => stderr(data, folder));
      childProcess.on("error", error);
      childProcess.on("close", (code) =>
        print(chalk.blue(`migration done for ${folder}`))
      );
    }
  }
}

copyEnvSampleInEnv();
migrate();

import chalk from "chalk";
import path from "path";
import {
  listPackages,
  print,
  getPackageJson,
  runCommand,
  copyFile,
  getArg
} from "./utils.mjs";

const packages = listPackages();

function copyEnvSampleInEnv() {
  for (const folder of packages) {
    const envPath = path.join("packages", folder, ".env");
    const envSamplePath = path.join("packages", folder, ".env.sample");
    copyFile(envSamplePath, envPath);
  }
}

async function migrate() {
  for (const folder of packages) {
    const packageJson = getPackageJson(folder);
    if (packageJson.scripts.migrate) {
      const child = runCommand("yarn migrate", folder);
      child.on("close", () =>
        print(chalk.blue(`migration done for ${folder}`))
      );
    }
  }
}

const migrateNeeded = getArg("--migrate");
const envNeeded = getArg("--env");

if (envNeeded) {
  copyEnvSampleInEnv();
}
if (migrateNeeded) {
  migrate();
}
if (!migrateNeeded && !envNeeded) {
  print(chalk.yellow("no argument provided"));
}



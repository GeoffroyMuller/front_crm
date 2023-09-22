import chalk from "chalk";
import path from "path";
import * as fs from "fs";
import {
  listPackages,
  print,
  getPackageJson,
  runCommand,
  getArg,
} from "./utils.mjs";

import { generatekeypair } from "./generate-keypair.mjs";

const packages = listPackages();

function copyFile(source, target) {
  if (!fs.existsSync(source)) return;
  fs.copyFileSync(source, target);
  print(
    `${chalk.green("☑")} Copied ${chalk.blue(source)} to ${chalk.blue(target)}`
  );
}

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
    if (packageJson?.scripts?.migrate) {
      const child = runCommand("yarn migrate", folder);
      child.on("close", () =>
        print(`${chalk.green("☑")} migration done for ${chalk.blue(folder)}`)
      );
    }
  }
}

if (getArg("-all")) {
  // generatekeypair();
  copyEnvSampleInEnv();
  migrate();
} else {
  const migrateNeeded = getArg("-migrate");
  const envNeeded = getArg("-env");
  const generateKeypairNeeded = getArg("-keypair");

  if (envNeeded) {
    copyEnvSampleInEnv();
  }
  if (migrateNeeded) {
    migrate();
  }
  if (generateKeypairNeeded) {
    generatekeypair();
  }
  if (!migrateNeeded && !envNeeded && !generateKeypairNeeded) {
    print(chalk.yellow("⚠ no argument provided ⚠"));
  }
}

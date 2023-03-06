import chalk from "chalk";
import { exec } from "child_process";
import * as fs from "fs";
import path from "path";

/**
 * @returns {string[]} list of packages
 * 
*/
export function listPackages() {
    return fs.readdirSync(path.join("packages"));
}

export function getPackageJson(packageName) {
    const packageJsonPath = path.join("packages", packageName, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    return packageJson;
}

export const print = console.log;
export const folderColored = (folder) => chalk.bgGrey(`[${folder}]`) + ":";

export const stdout = (data, folder) => print(`${folderColored(folder)}${data}`);
export const stderr = (data, folder) => print(`${folderColored(folder)}${data}`);
export const error = (data) => print(chalk.red(`error: ${data.message}`));
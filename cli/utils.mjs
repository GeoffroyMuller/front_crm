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

export function runCommand(command, folder) {
    const child = exec(command, { cwd: path.join("packages", folder) });
    child.stdout.on("data", (data) => stdout(data, folder));
    child.stderr.on("data", (data) => stderr(data, folder));
    child.on("error", (data) => error(data));
    return child;
}

export function copyFile(source, target) {
    if (!fs.existsSync(source)) return;
    fs.copyFileSync(source, target);
    print(chalk.blue(`Copied ${source} to ${target}`));
}

export const args = process.argv.slice(2);
export function getArg(name) {
    for (const arg of args) {
        if (arg.startsWith(name)) {
            const value = arg.split("=")?.[1];
            if (value != null) return value;
            return true;
        }
    }
    return null;
}
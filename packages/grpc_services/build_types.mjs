import { exec } from "child_process";
import * as fs from "fs";
import path from "path";

function runCommand(command, folder) {
  const child = exec(command, { cwd: path.join(folder) });
  child.stdout.on("data", (data) => stdout(data, folder));
  child.stderr.on("data", (data) => stderr(data, folder));
  child.on("error", (data) => error(data));
  return child;
}

function listProtos() {
  return fs
    .readdirSync(path.join("proto/"))
    .filter((filename) => filename.endsWith(".proto"));
}

const protoArray = listProtos();

for (const proto of protoArray) {
  const filename = proto.substring(0, proto.length - ".proto".length);
  console.log({ filename, proto });
  const command = `npx proto-loader-gen-types ${proto} --longs=String --enums=String --defaults --oneofs --grpcLib=@grpc/grpc-js --outDir=../types/${filename}`;
  console.error({ command });
  runCommand(command, "proto");
}

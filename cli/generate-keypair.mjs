import NodeRSA from "node-rsa";
import * as fs from "fs";
import path from "path";
import chalk from "chalk";

export function generatekeypair() {
  const key = new NodeRSA({ b: 2048 });
  let keypair = {
    private: key.exportKey(),
    public: key.exportKey("public"),
  };

  fs.writeFileSync(
    path.join("packages", "api_auth", "private.key"),
    keypair.private
  );

  fs.writeFileSync(
    path.join("packages", "api_auth", "public.key.pub"),
    keypair.public
  );

  fs.writeFileSync(
    path.join("packages", "core_api", "public.key.pub"),
    keypair.public
  );

  console.log(chalk.blue("PUBLIC KEY:"));
  console.log(keypair.public);
  console.log(chalk.blue("PRIVATE KEY:"));
  console.log(keypair.private);
  console.log(`\n${chalk.green("☑")} Keys generated successfully!`);
}

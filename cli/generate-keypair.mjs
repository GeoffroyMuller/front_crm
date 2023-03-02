import NodeRSA from "node-rsa";
import * as fs from "fs"; 
import path from "path";
import chalk from 'chalk';


const key = new NodeRSA({ b: 2048 });
let keypair = {
  private: key.exportKey(),
  public: key.exportKey("public")
};

fs.writeFileSync(
  path.join("packages", "auth_service", "private.key"),
  keypair.private
);

fs.writeFileSync(
  path.join("packages", "auth_service", "public.key.pub"),
  keypair.public
);

fs.writeFileSync(
  path.join("packages", "core_api", "public.key.pub"),
  keypair.public
); 

console.log(chalk.yellow('PUBLIC KEY:'));
console.log(chalk.blue(keypair.public));
console.log(chalk.yellow('PRIVATE KEY:'));
console.log(chalk.blue(keypair.private));
console.log(chalk.green('Keys generated successfully!'));
import NodeRSA from "node-rsa";
import * as fs from "fs"; 
import path from "path";


const key = new NodeRSA({ b: 2048 });
let keypair = {
  private: key.exportKey(),
  public: key.exportKey("public")
};

console.log(keypair);

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
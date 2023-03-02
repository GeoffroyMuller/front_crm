const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 2048 });
let keypair = {
  private: key.exportKey(),
  public: key.exportKey("public")
};
console.log(keypair);
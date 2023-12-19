import { loadSync } from "@grpc/proto-loader";
import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import { ProtoGrpcType } from "grpcservice/types/media/media";
import { MediaServiceHandlers } from "grpcservice/types/media/MediaService";
import mediaService from "./media.service";

const path = require("path");

const PROTO_PATH = path.join(
  __dirname,
  "../../grpc_services/proto/media.proto"
);

const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const hello_proto = loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const Find: MediaServiceHandlers["Find"] = async (call, callback) => {
  const { modelId, auth, model } = call.request;
  if (auth) {
    callback(null, {
      data: (
        await mediaService.find(
          {
            $eq: {
              id_model: modelId,
              model,
            },
          },
          auth
        )
      ).results,
    });
  } else {
    callback({ message: "no auth", name: 'NOAUTH' });
  }
};

function startServer() {
  const server = new Server();
  server.addService(hello_proto.MediaService.service, { Find });
  const PORT = 4000;
  const host = `localhost:${PORT}`;
  server.bindAsync(host, ServerCredentials.createInsecure(), (error) => {
    if (error) {
      console.log("An error has occurred in bindAsync", error);
      return;
    }
    server.start();
    console.log(`GRPC Server listening on port ${host}`);
  });
}

startServer();

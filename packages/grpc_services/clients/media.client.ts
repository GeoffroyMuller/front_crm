import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { credentials } from "@grpc/grpc-js";
const path = require("path");

import { ProtoGrpcType } from "../types/media/media";

const PROTO_PATH = path.join(__dirname, "../proto/media.proto");
const packageDefinition = loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const proto = loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

let mediaService: typeof proto.MediaService = undefined;
export function getMediaService() {
  if (!mediaService) {
    mediaService = new proto.MediaService(
      "localhost:4000",

      credentials.createInsecure()
    );
  }
  return mediaService;
}
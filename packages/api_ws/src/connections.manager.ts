import { Socket } from "socket.io";

type Connections = {
  [idUser: number]: Socket["id"];
};

const connections: Connections = {};

export default {
  get(idUser: number) {
    return connections[idUser];
  },
  set(idUser: number, socketID: Socket["id"]) {
    connections[idUser] = socketID;
  },
};

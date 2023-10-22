import express from "express";
import http from "http";
import { Server } from "socket.io";
import ConnectionsManager from "./connections.manager";
import { notifyUsersConsume } from "core_api/services/realtime.service";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

notifyUsersConsume((eventName, data, users) => {
  console.log({
    eventName,
    data,
    users,
  });
});

server.listen(3009, () => {
  console.log("listening on *:3009");
});

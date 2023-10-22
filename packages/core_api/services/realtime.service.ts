import { User } from "../types";
import RabbitMqService from "./rabbitmq.service";

const rabbitmq = new RabbitMqService("notifications");

export const notifyUsers = (
  eventName: string,
  data: any,
  users: Array<User["id"]> | User["id"]
) => {
  rabbitmq.send(
    JSON.stringify({
      users,
      data,
      eventName,
    })
  );
};
export const notifyUsersConsume = (
  onMessage: (
    eventName: string,
    data: any,
    users: Array<User["id"]> | User["id"]
  ) => void
) => {
  rabbitmq.consume((msg) => {
    if (!msg) return;
    const {
      users,
      data,
      eventName,
    } = JSON.parse(msg.content.toString());
    onMessage(eventName, data, users);
  });
};

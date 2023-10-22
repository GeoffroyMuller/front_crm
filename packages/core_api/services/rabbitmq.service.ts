import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";

export default class RabbitMqService {
  connection: Connection;
  channel: Channel;
  queue: string;

  constructor(queue: string) {
    this.queue = queue;
    this.connectToRabbitMQ = this.connectToRabbitMQ.bind(this);
    this.send = this.send.bind(this);
    this.consume = this.consume.bind(this);

    // @ts-ignore
    this.connection = null;
    // @ts-ignore
    this.channel = null;
  }

  async connectToRabbitMQ() {
    if (this.connection != null && this.channel != null) return;
    this.connection = await amqp.connect("amqp://localhost");
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(this.queue);
  }

  async send(msg: string) {
    await this.connectToRabbitMQ();
    this.channel.sendToQueue(this.queue, Buffer.from(msg));
  }

  async consume(onMessage: (msg: ConsumeMessage | null) => void) {
    await this.connectToRabbitMQ();
    this.channel.consume(this.queue, onMessage, {
      noAck: true,
    });
  }
}

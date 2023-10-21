import amqp from "amqplib/callback_api";

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    const queue = "notification";
    channel.assertQueue(queue, {
      durable: false,
    });


    // SEND 
    const msg = "test message";
    channel.sendToQueue(queue, Buffer.from(msg));

    //CONSUME
    channel.consume(queue, function(msg) {
        if (msg) {
            console.log(" [x] Received \"%s\"", msg.content.toString());
        } else {
            console.log(" [x] NO Received");
        }
       
    }, {
        noAck: true
    });

  });
  setTimeout(function () {
    connection.close();
    process.exit(0);
  }, 500);
});

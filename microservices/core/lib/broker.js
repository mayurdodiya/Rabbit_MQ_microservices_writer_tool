const amqp = require("amqplib");
const EventEmitter = require("events");
const log = require("./logger.lib").log;



const messageEmitter = new EventEmitter();

const exchanges = {
  direct: "direct_exchange",
};

exports.sendMessages = async (msg, queue, routingKey) => {
  try {
    const connection = await amqp.connect(process.env.RMQ_CONNECTION_URL);
    const channel = await connection.createChannel();

    const exchangeName = exchanges["direct"]; //Exchange Name

    if (!exchangeName || !queue) {
      throw new Error("Invalid exchange, queue, or routing key");
    }

    await channel.assertExchange(exchangeName, "direct", {
      durable: false,
    });
    await channel.assertQueue(queue, { durable: false });

    await channel.bindQueue(queue, exchangeName, routingKey);

    channel.publish(exchangeName, routingKey, Buffer.from(msg), {
      persistent: true,
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    log.error("Error in Sending Messages:", error);
  }
};

exports.receiveMessages = async (queue, routingKey) => {
  try {
    const connection = await amqp.connect(process.env.RMQ_CONNECTION_URL);
    const channel = await connection.createChannel();

    const exchangeName = exchanges["direct"];

    await channel.assertExchange(exchangeName, "direct", { durable: false });
    const assertQueue = await channel.assertQueue(queue, {
      durable: false,
    });

    await channel.bindQueue(assertQueue.queue, exchangeName, routingKey);

    channel.consume(assertQueue.queue, (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();

        // Emit an event with the received message
        messageEmitter.emit("messageReceived", {
          content: messageContent,
          routingKey: msg.fields.routingKey,
          timestamp: new Date(),
        });

        channel.ack(msg);
      }
    });
  } catch (error) {
    log.error("Error while Recieving Message: ", error);
  }
};

// Function to get the message emitter
exports.getMessageEmitter = () => {
  return messageEmitter;
};

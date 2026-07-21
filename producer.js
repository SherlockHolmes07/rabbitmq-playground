const amqp = require("amqplib");

async function send() {
  const connection = await amqp.connect("amqp://localhost"); // Connect to RabbitMQ server
  const channel = await connection.createChannel(); // Create a channel

  const queue = "hello";
  await channel.assertQueue(queue, { durable: false });

  for (let i = 0; i < 10; i++) {
    const message = "Hello from producer!";
    await sleep(4000); // Simulate processing time
    channel.sendToQueue(queue, Buffer.from(message));
    console.log("Sent:", message);
  }

  setTimeout(() => connection.close(), 500);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

send();

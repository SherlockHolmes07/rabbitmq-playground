const amqp = require('amqplib');


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function receive() {
  const connection = await amqp.connect('amqp://localhost'); // Connect to RabbitMQ server
  const channel = await connection.createChannel(); // Create a channel

  const queue = 'hello';
  await channel.assertQueue(queue, { durable: false });

  console.log('Waiting for messages...');
  channel.consume(queue, async (msg) => {
    await sleep(1000);
    console.log('Received:', msg.content.toString());
    channel.ack(msg);
  });
}

receive();
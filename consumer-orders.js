const amqp = require('amqplib');

async function receive() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'events';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const { queue } = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(queue, exchange, 'order.*');

  console.log('[orders consumer] waiting for order.* events...');
  channel.consume(queue, (msg) => {
    console.log('[orders consumer] got:', msg.content.toString());
    channel.ack(msg);
  });
}

receive();
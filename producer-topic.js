const amqp = require('amqplib');

async function send() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();

  const exchange = 'events';
  await channel.assertExchange(exchange, 'topic', { durable: false });

  const messages = [
    { key: 'order.created', body: 'Order #101 created' },
    { key: 'order.shipped', body: 'Order #101 shipped' },
    { key: 'user.created', body: 'User Alice signed up' },
    { key: 'user.deleted', body: 'User Bob deleted account' },
    { key: 'order.cancelled', body: 'Order #102 cancelled' },
    { key: 'order.updated', body: 'Order #103 updated' },
    // created events
    { key: 'order.created', body: 'Order #104 created' },
    { key: 'user.created', body: 'User Charlie signed up' },
    { key: 'order.created', body: 'Order #105 created' },
  ];

  for (const msg of messages) {
    await sleep(8000);
    channel.publish(exchange, msg.key, Buffer.from(msg.body));
    console.log(`Sent [${msg.key}]: ${msg.body}`);
  }

  setTimeout(() => connection.close(), 500);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

send();
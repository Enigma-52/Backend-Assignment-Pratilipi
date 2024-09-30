import { Channel } from 'amqplib';

export const setupUserRegisteredConsumer = (channel: Channel) => {
  const exchange = 'user_events';
  const queue = 'product_service_user_registered';
  const routingKey = 'user.registered';

  channel.assertExchange(exchange, 'topic', { durable: false });
  channel.assertQueue(queue, { durable: false });
  channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const userData = JSON.parse(msg.content.toString());
      console.log('Received user registered event:', userData);
      // Here you can add any logic needed when a new user is registered
      // For example, you might want to create a welcome offer for the new user

      channel.ack(msg);
    }
  });
};
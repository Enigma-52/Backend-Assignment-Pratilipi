import amqp from 'amqplib';
import { setupOrderPlacedConsumer } from '../events/consumers/orderConsumer';
import { setupUserRegisteredConsumer } from '../events/consumers/userConsumer';

let channel: amqp.Channel;

export const initializeRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    
    await channel.assertExchange('product_events', 'topic', { durable: false });
    
    // Set up consumers
    setupOrderPlacedConsumer(channel);
    setupUserRegisteredConsumer(channel);
    
    console.log('Connected to RabbitMQ and set up consumers');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
    process.exit(1);
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel not initialized');
  return channel;
};
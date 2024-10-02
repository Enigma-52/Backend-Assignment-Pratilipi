import { Channel, ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from '../../config/rabbitmq';

export const startProductConsumer = async (): Promise<void> => {
  try {
    const connection = await connectRabbitMQ();
    const channel: Channel = await connection.createChannel();

    // Listen for 'product_created' events
    await channel.assertQueue('product_created', { durable: false });
    channel.consume('product_created', (msg: ConsumeMessage | null) => {
      if (msg) {
        const product = JSON.parse(msg.content.toString());
        console.log('Received product_created event:', product);
        // Handle new product creation (e.g., update local product catalog)
        channel.ack(msg);
      }
    });

    console.log('Product consumer started for Order service');
  } catch (error) {
    console.error('Error starting product consumer:', error);
  }
};
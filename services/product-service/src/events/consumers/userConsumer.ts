import { Channel, ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from '../../config/rabbitmq';

export const startUserConsumer = async (): Promise<void> => {
  try {
    const connection = await connectRabbitMQ();
    const channel: Channel = await connection.createChannel();

    // Listen for 'user_registered' events
    await channel.assertQueue('user_registered', { durable: false });
    channel.consume('user_registered', (msg: ConsumeMessage | null) => {
      if (msg) {
        const user = JSON.parse(msg.content.toString());
        console.log('Received user_registered event:', user);
        // Handle user registration if needed
        // For now, we're just logging the event
        channel.ack(msg);
      }
    });

    console.log('User consumer started for Product service');
  } catch (error) {
    console.error('Error starting user consumer:', error);
  }
};
import { Channel, ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from '../../config/rabbitmq';

export const startUserConsumers = async (): Promise<void> => {
  try {
    const connection = await connectRabbitMQ();
    const channel: Channel = await connection.createChannel();

    // Example: Listening for events that might affect user state
    await channel.assertQueue('user_related_events', { durable: false });
    channel.consume('user_related_events', (msg: ConsumeMessage | null) => {
      if (msg) {
        const content = msg.content.toString();
        console.log('Received user-related event:', content);
        // Process the event and update user state if necessary
        channel.ack(msg);
      }
    });

    console.log('User service consumers started');
  } catch (error) {
    console.error('Error starting user consumers:', error);
  }
};
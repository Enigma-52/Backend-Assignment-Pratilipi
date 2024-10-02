import amqp, { Channel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: Channel;

export const connectRabbitMQ = async (): Promise<Connection> => {
  try {
    const connection: Connection = await amqp.connect(process.env.RABBITMQ_URL as string);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
    return connection; // Return the connection object
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    process.exit(1);
  }
};

export const publishMessage = async (queue: string, message: string): Promise<void> => {
  try {
    await channel.assertQueue(queue, { durable: false });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to queue ${queue}`);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};
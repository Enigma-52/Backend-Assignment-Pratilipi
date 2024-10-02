import { Channel, ConsumeMessage } from 'amqplib';
import { connectRabbitMQ } from '../../config/rabbitmq';
import { productService } from '../../services/productService';

export const startOrderConsumer = async (): Promise<void> => {
  try {
    const connection = await connectRabbitMQ();
    const channel: Channel = await connection.createChannel();

    // Listen for 'order_placed' events
    await channel.assertQueue('order_placed', { durable: false });
    channel.consume('order_placed', async (msg: ConsumeMessage | null) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        console.log('Received order_placed event:', order);
        
        // Update inventory for each product in the order
        for (const item of order.items) {
          await productService.updateInventory(item.productId, -item.quantity);
        }
        
        channel.ack(msg);
      }
    });

    console.log('Order consumer started for Product service');
  } catch (error) {
    console.error('Error starting order consumer:', error);
  }
};
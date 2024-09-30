import { Channel } from 'amqplib';
import { ProductService } from '../../services/productService';

export const setupOrderPlacedConsumer = (channel: Channel) => {
  const exchange = 'order_events';
  const queue = 'product_service_order_placed';
  const routingKey = 'order.placed';

  channel.assertExchange(exchange, 'topic', { durable: false });
  channel.assertQueue(queue, { durable: false });
  channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const orderData = JSON.parse(msg.content.toString());
      console.log('Received order placed event:', orderData);

      // Update inventory for each product in the order
      for (const item of orderData.items) {
        await ProductService.updateInventory(item.productId, item.quantity);
      }

      channel.ack(msg);
    }
  });
};
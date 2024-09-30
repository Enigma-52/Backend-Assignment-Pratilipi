import { getChannel } from '../../config/rabbitmq';
import { IProductOutput } from '../../types/product';

export const publishProductCreated = async (product: IProductOutput) => {
  const channel = getChannel();
  channel.publish('product_events', 'product.created', Buffer.from(JSON.stringify(product)));
};

export const publishInventoryUpdated = async (product: IProductOutput) => {
  const channel = getChannel();
  channel.publish('product_events', 'inventory.updated', Buffer.from(JSON.stringify(product)));
};
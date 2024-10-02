import { publishMessage } from '../../config/rabbitmq';
import { IProduct } from '../../models/Product';

export const emitProductCreated = async (product: IProduct): Promise<void> => {
  await publishMessage('product_created', JSON.stringify(product));
};

export const emitInventoryUpdated = async (product: IProduct): Promise<void> => {
  await publishMessage('inventory_updated', JSON.stringify({
    productId: product._id,
    newInventory: product.inventory
  }));
};
import { publishMessage } from '../../config/rabbitmq';
import { IOrder } from '../../models/Order';

export const emitOrderPlaced = async (order: IOrder): Promise<void> => {
  await publishMessage('order_placed', JSON.stringify(order));
};

export const emitOrderShipped = async (order: IOrder): Promise<void> => {
  await publishMessage('order_shipped', JSON.stringify(order));
};
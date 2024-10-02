import Order, { IOrder, IOrderItem } from '../models/Order';
import { emitOrderPlaced, emitOrderShipped } from '../events/producers/orderProducer';

export class OrderService {
  async createOrder(userId: string, items: IOrderItem[]): Promise<IOrder> {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = new Order({ userId, items, total });
    await newOrder.save();
    await emitOrderPlaced(newOrder);
    return newOrder;
  }

  async getOrder(orderId: string): Promise<IOrder | null> {
    return Order.findById(orderId);
  }

  async getUserOrders(userId: string): Promise<IOrder[]> {
    return Order.find({ userId });
  }

  async updateOrderStatus(orderId: string, status: 'pending' | 'shipped' | 'delivered'): Promise<IOrder | null> {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (updatedOrder && status === 'shipped') {
      await emitOrderShipped(updatedOrder);
    }
    return updatedOrder;
  }

  async getAllOrders(): Promise<IOrder[]> {
    return Order.find();
  }
}

export const orderService = new OrderService();
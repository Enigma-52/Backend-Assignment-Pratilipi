import { Request, Response } from 'express';
import { orderService } from '../services/orderService';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, items } = req.body;
    const newOrder = await orderService.createOrder(userId, items);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await orderService.getOrder(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error fetching order', error: error });
  }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const orders = await orderService.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user orders', error: error });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating order status', error: error });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error });
  }
};
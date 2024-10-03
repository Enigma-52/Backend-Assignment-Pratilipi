import { beforeAll, afterAll, beforeEach , describe, it, expect ,jest} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import Order from '../src/models/Order';
import { connectRabbitMQ } from '../src/config/rabbitmq';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Order.deleteMany({});
});

describe('Order API', () => {
  const sampleOrder = {
    userId: '123456',
    items: [
      { productId: 'product1', quantity: 2, price: 10 },
      { productId: 'product2', quantity: 1, price: 15 },
    ],
  };

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send(sampleOrder);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.userId).toBe(sampleOrder.userId);
    expect(res.body.total).toBe(35); 
    expect(res.body.status).toBe('pending');
  });

  it('should get all orders', async () => {
    await Order.create(sampleOrder);
    await Order.create({
      ...sampleOrder,
      userId: '789012',
    });

    const res = await request(app).get('/api/orders');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(2);
  });

  it('should get a specific order', async () => {
    const order = await Order.create(sampleOrder);

    const res = await request(app).get(`/api/orders/${order._id}`);
    
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(order._id.toString());
    expect(res.body.userId).toBe(sampleOrder.userId);
  });

  it('should return 404 for non-existent order', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/orders/${fakeId}`);
    
    expect(res.status).toBe(404);
  });

  it('should get orders for a specific user', async () => {
    await Order.create(sampleOrder);
    await Order.create(sampleOrder);
    await Order.create({ ...sampleOrder, userId: 'differentUser' });

    const res = await request(app).get(`/api/orders/user/${sampleOrder.userId}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(2);
    expect(res.body[0].userId).toBe(sampleOrder.userId);
    expect(res.body[1].userId).toBe(sampleOrder.userId);
  });

  it('should update order status', async () => {
    const order = await Order.create(sampleOrder);

    const res = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .send({ status: 'shipped' });
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('shipped');
  });

  it('should return 404 when updating status of non-existent order', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/orders/${fakeId}/status`)
      .send({ status: 'shipped' });
    
    expect(res.status).toBe(404);
  });
});

describe('Order Service Integration', () => {
  it('should handle RabbitMQ connection error', async () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockExit = jest.spyOn(process, 'exit').mockImplementation((number) => { throw new Error('process.exit: ' + number); });

    (connectRabbitMQ as jest.Mock).mockImplementationOnce(() => {
        return Promise.reject(new Error('Connection failed'));
    });

    await expect(connectRabbitMQ()).rejects.toThrow('Connection failed');
    
    expect(mockConsoleError).toHaveBeenCalledWith('Failed to connect to RabbitMQ:', expect.any(Error));
    expect(mockExit).toHaveBeenCalledWith(1);

    mockConsoleError.mockRestore();
    mockExit.mockRestore();
  });
});
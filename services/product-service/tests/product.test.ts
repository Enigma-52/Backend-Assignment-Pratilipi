import { beforeAll, afterAll, beforeEach , describe, it, expect} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import Product from '../src/models/Product';

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI_TEST as string);
});

afterAll(async () => {
  // Disconnect and close the connection
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the products collection before each test
  await Product.deleteMany({});
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 19.99,
        inventory: 100
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Product');
  });

  it('should get all products', async () => {
    // First, create a product
    await Product.create({
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      inventory: 100
    });

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
  });

  it('should update a product', async () => {
    const product = await Product.create({
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      inventory: 100
    });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .send({
        price: 24.99,
        inventory: 50
      });
    expect(res.status).toBe(200);
    expect(res.body.price).toBe(24.99);
    expect(res.body.inventory).toBe(50);
  });

  it('should delete a product', async () => {
    const product = await Product.create({
      name: 'Test Product',
      description: 'This is a test product',
      price: 19.99,
      inventory: 100
    });

    const res = await request(app).delete(`/api/products/${product._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Product deleted successfully');

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });
});
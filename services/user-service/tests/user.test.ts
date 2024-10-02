import { beforeAll, afterAll, beforeEach , describe, it, expect} from '@jest/globals';
import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI_TEST as string);
});

afterAll(async () => {
  // Disconnect and close the connection
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear the users collection before each test
  await User.deleteMany({});
});

describe('User Registration', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'testuser');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
  });

  // Add more tests for login, profile update, etc.
});
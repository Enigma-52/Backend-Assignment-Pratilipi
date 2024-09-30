import express from 'express';
import { json } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { productRouter } from './routes/productRoutes';
import { initializeRabbitMQ } from './config/rabbitmq';
import { config } from 'dotenv';

config(); // Load environment variables

const app = express();
const prisma = new PrismaClient();

app.use(json());
app.use('/api/products', productRouter);

const start = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');

    console.log('Attempting to initialize RabbitMQ...');
    await initializeRabbitMQ();
    console.log('RabbitMQ initialized');

    const port = process.env.PORT || 3001;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Product service listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start the application:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('Disconnected from PostgreSQL database');
  process.exit(0);
});

export { app };
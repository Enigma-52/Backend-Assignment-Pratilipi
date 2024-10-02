import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { connectRabbitMQ } from './config/rabbitmq';
import orderRoutes from './routes/orderRoutes';
import { startProductConsumer } from './events/consumers/productConsumer';
import { startUserConsumer } from './events/consumers/userConsumer';
import client from 'prom-client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const METRICS_PORT = process.env.METRICS_PORT || 9103;

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'order-service'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

app.use(express.json());

// Routes
app.use('/api/orders', orderRoutes);

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ and start consumers
connectRabbitMQ().then(() => {
  startProductConsumer();
  startUserConsumer();
});

// Create a separate Express app for metrics
const metricsApp = express();

// Expose metrics endpoint
metricsApp.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start the main application
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});

// Start the metrics server
metricsApp.listen(METRICS_PORT, () => {
  console.log(`Metrics available at http://localhost:${METRICS_PORT}/metrics`);
});

export default app;
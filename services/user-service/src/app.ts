import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { connectRabbitMQ } from './config/rabbitmq';
import userRoutes from './routes/userRoutes';
import { startUserConsumers } from './events/consumers/userConsumer';
import client from 'prom-client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const METRICS_PORT = process.env.METRICS_PORT || 9101;

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'user-service'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ and start consumers
connectRabbitMQ().then(() => {
  startUserConsumers();
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
  console.log(`User service running on port ${PORT}`);
});

// Start the metrics server
metricsApp.listen(METRICS_PORT, () => {
  console.log(`Metrics available at http://localhost:${METRICS_PORT}/metrics`);
});

export default app;
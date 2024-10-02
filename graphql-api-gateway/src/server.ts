import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './schema/resolvers';
import { UserAPI, ProductAPI, OrderAPI } from './dataSources';
import { authMiddleware, JWTPayload } from './utils/authMiddleware';
import NodeCache from 'node-cache';
import client from 'prom-client';
import dotenv from 'dotenv';

dotenv.config();

interface ContextValue {
  dataSources: {
    userAPI: UserAPI;
    productAPI: ProductAPI;
    orderAPI: OrderAPI;
  };
  user: JWTPayload | null;
  cache: NodeCache;
}

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'graphql-gateway'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes default TTL

  const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<ContextValue> => {
        const { user } = authMiddleware(req);
        return {
          dataSources: {
            userAPI: new UserAPI(),
            productAPI: new ProductAPI(),
            orderAPI: new OrderAPI(),
          },
          user,
          cache,
        };
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

  // Create a separate Express app for metrics
  const metricsApp = express();

  // Expose metrics endpoint
  metricsApp.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  const METRICS_PORT = process.env.METRICS_PORT || 9200;
  metricsApp.listen(METRICS_PORT, () => {
    console.log(`📊 Metrics available at http://localhost:${METRICS_PORT}/metrics`);
  });
}

startApolloServer().catch((err) => console.error(err));
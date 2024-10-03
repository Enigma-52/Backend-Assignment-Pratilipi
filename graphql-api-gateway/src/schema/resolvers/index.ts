import { GraphQLError } from 'graphql';
import { UserAPI, ProductAPI, OrderAPI } from '../../dataSources';
import NodeCache from 'node-cache';

interface Context {
  dataSources: {
    userAPI: UserAPI;
    productAPI: ProductAPI;
    orderAPI: OrderAPI;
  };
  user: {
    id: string;
    token: string;
    role: string;
  } | null;
  cache: NodeCache;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
}

interface Order {
  id: string;
  userId: string;
  products: Array<{ product: Product; quantity: number }>;
  totalAmount: number;
  status: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

export const resolvers = {
  Query: {
    me: (_: any, __: any, { dataSources, user }: Context): Promise<User> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.userAPI.getUserProfile(user.token);
    },
    products: async (_: any, __: any, { dataSources, cache }: Context): Promise<Product[]> => {
      const cacheKey = 'all_products';
      const cachedProducts = cache.get<Product[]>(cacheKey);
      if (cachedProducts) return cachedProducts;
      
      const products = await dataSources.productAPI.getAllProducts();
      cache.set(cacheKey, products);
      return products;
    },
    product: async (_: any, { id }: { id: string }, { dataSources, cache }: Context): Promise<Product> => {
      const cacheKey = `product_${id}`;
      const cachedProduct = cache.get<Product>(cacheKey);
      if (cachedProduct) return cachedProduct;
      
      const product = await dataSources.productAPI.getProduct(id);
      cache.set(cacheKey, product);
      return product;
    },
    orders: (_: any, __: any, { dataSources, user }: Context): Promise<Order[]> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.orderAPI.getAllOrders();
    },
    order: (_: any, { id }: { id: string }, { dataSources, user }: Context): Promise<Order> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.orderAPI.getOrder(id);
    },
    userOrders: (_: any, __: any, { dataSources, user }: Context): Promise<Order[]> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.orderAPI.getUserOrders(user.id);
    },
  },
  Mutation: {
    registerUser: async (_: any, { input }: { input: { username: string; email: string; password: string } }, { dataSources }: { dataSources: { userAPI: UserAPI } }) => {
      try {
        console.log('Resolver received input:', { ...input, password: '[REDACTED]' });
        const result = await dataSources.userAPI.registerUser(input);
        console.log('Resolver received result:', result);
        return {
          message: result.message,
          user: result.user
        };
      } catch (error) {
        console.error('Error in registerUser resolver:', error);
        throw new GraphQLError('Failed to register user', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    loginUser: async (_: any, { input }: { input: { email: string; password: string } }, { dataSources }: Context): Promise<AuthPayload> => {
      try {
        return await dataSources.userAPI.loginUser(input);
      } catch (error) {
        console.error('Error in loginUser resolver:', error);
        throw new GraphQLError('Failed to login', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    updateUserProfile: async (_: any, { input }: { input: { username: string; email: string; password: string } }, { dataSources, user }: Context): Promise<User> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      try {
        return await dataSources.userAPI.updateUserProfile(input, user.token);
      } catch (error) {
        console.error('Error in updateUserProfile resolver:', error);
        throw new GraphQLError('Failed to update profile', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    createProduct: async (_: any, { input }: { input: Omit<Product, 'id'> }, { dataSources, user, cache }: Context): Promise<Product> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      try {
        const newProduct = await dataSources.productAPI.createProduct(input);
        cache.del('all_products');
        return newProduct;
      } catch (error) {
        console.error('Error in createProduct resolver:', error);
        throw new GraphQLError('Failed to create product', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    updateProduct: async (_: any, { id, input }: { id: string; input: Omit<Product, 'id'> }, { dataSources, user, cache }: Context): Promise<Product> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      try {
        const updatedProduct = await dataSources.productAPI.updateProduct(id, input);
        cache.del(`product_${id}`);
        cache.del('all_products');
        return updatedProduct;
      } catch (error) {
        console.error('Error in updateProduct resolver:', error);
        throw new GraphQLError('Failed to update product', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    deleteProduct: async (_: any, { id }: { id: string }, { dataSources, user, cache }: Context): Promise<boolean> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      try {
        const result = await dataSources.productAPI.deleteProduct(id);
        cache.del(`product_${id}`);
        cache.del('all_products');
        return result;
      } catch (error) {
        console.error('Error in deleteProduct resolver:', error);
        throw new GraphQLError('Failed to delete product', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    createOrder: async (_: any, { input }: { input: { products: Array<{ productId: string; quantity: number }> } }, { dataSources, user }: Context): Promise<Order> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      try {
        return await dataSources.orderAPI.createOrder({ ...input, userId: user.id });
      } catch (error) {
        console.error('Error in createOrder resolver:', error);
        throw new GraphQLError('Failed to create order', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
    updateOrderStatus: async (_: any, { id, status }: { id: string; status: string }, { dataSources, user }: Context): Promise<Order> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      try {
        return await dataSources.orderAPI.updateOrderStatus(id, status);
      } catch (error) {
        console.error('Error in updateOrderStatus resolver:', error);
        throw new GraphQLError('Failed to update order status', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
      }
    },
  },
};
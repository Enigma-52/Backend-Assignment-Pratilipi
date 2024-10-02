import { GraphQLError } from 'graphql';
import { UserAPI, ProductAPI, OrderAPI } from '../../dataSources/index';
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
  products: Array<{ productId: string; quantity: number }>;
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
    registerUser: (_: any, { input }: { input: Omit<User, 'id'> & { password: string } }, { dataSources }: Context): Promise<AuthPayload> => 
      dataSources.userAPI.registerUser(input),
    loginUser: (_: any, { input }: { input: { email: string; password: string } }, { dataSources }: Context): Promise<AuthPayload> => 
      dataSources.userAPI.loginUser(input),
    updateUserProfile: (_: any, { input }: { input: Partial<User> }, { dataSources, user }: Context): Promise<User> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.userAPI.updateUserProfile(input, user.token);
    },
    createProduct: async (_: any, { input }: { input: Omit<Product, 'id'> }, { dataSources, user, cache }: Context): Promise<Product> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      const newProduct = await dataSources.productAPI.createProduct(input);
      cache.del('all_products');
      return newProduct;
    },
    updateProduct: async (_: any, { id, input }: { id: string; input: Partial<Product> }, { dataSources, user, cache }: Context): Promise<Product> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      const updatedProduct = await dataSources.productAPI.updateProduct(id, input);
      cache.del(`product_${id}`);
      cache.del('all_products');
      return updatedProduct;
    },
    deleteProduct: async (_: any, { id }: { id: string }, { dataSources, user, cache }: Context): Promise<boolean> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      const result = await dataSources.productAPI.deleteProduct(id);
      cache.del(`product_${id}`);
      cache.del('all_products');
      return result;
    },
    createOrder: (_: any, { input }: { input: Omit<Order, 'id' | 'userId' | 'status'> }, { dataSources, user }: Context): Promise<Order> => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return dataSources.orderAPI.createOrder({ ...input, userId: user.id });
    },
    updateOrderStatus: (_: any, { id, status }: { id: string; status: string }, { dataSources, user }: Context): Promise<Order> => {
      if (!user || user.role !== 'admin') throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
      return dataSources.orderAPI.updateOrderStatus(id, status);
    },
  },
};
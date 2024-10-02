import { beforeEach , describe, it, expect ,jest} from '@jest/globals';
import { resolvers } from '../src/schema/resolvers';
import { GraphQLError } from 'graphql';
import NodeCache from 'node-cache';

describe('Resolvers', () => {
  let mockContext;
  let mockCache;

  beforeEach(() => {
    mockCache = new NodeCache();
    mockContext = {
      dataSources: {
        userAPI: {
          getUserProfile: jest.fn(),
          registerUser: jest.fn(),
          loginUser: jest.fn(),
          updateUserProfile: jest.fn(),
        },
        productAPI: {
          getAllProducts: jest.fn(),
          getProduct: jest.fn(),
          createProduct: jest.fn(),
          updateProduct: jest.fn(),
          deleteProduct: jest.fn(),
        },
        orderAPI: {
          getAllOrders: jest.fn(),
          getOrder: jest.fn(),
          getUserOrders: jest.fn(),
          createOrder: jest.fn(),
          updateOrderStatus: jest.fn(),
        },
      },
      user: { id: '1', token: 'mock-token', role: 'user' },
      cache: mockCache,
    };
  });

  describe('Query resolvers', () => {
    it('should resolve me query', async () => {
      const user = { id: '1', username: 'testuser', email: 'test@example.com' };
      mockContext.dataSources.userAPI.getUserProfile.mockResolvedValue(user);

      const result = await resolvers.Query.me(null, {}, mockContext);

      expect(result).toEqual(user);
      expect(mockContext.dataSources.userAPI.getUserProfile).toHaveBeenCalledWith('mock-token');
    });

    it('should throw error for me query when not authenticated', async () => {
      mockContext.user = null;

      await expect(resolvers.Query.me(null, {}, mockContext)).rejects.toThrow(GraphQLError);
    });

    it('should resolve products query and cache the result', async () => {
      const products = [{ id: '1', name: 'Test Product' }];
      mockContext.dataSources.productAPI.getAllProducts.mockResolvedValue(products);

      const result = await resolvers.Query.products(null, {}, mockContext);

      expect(result).toEqual(products);
      expect(mockContext.dataSources.productAPI.getAllProducts).toHaveBeenCalled();

      const cachedResult = await resolvers.Query.products(null, {}, mockContext);
      expect(cachedResult).toEqual(products);
      expect(mockContext.dataSources.productAPI.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mutation resolvers', () => {
    it('should resolve registerUser mutation', async () => {
      const input = { username: 'newuser', email: 'new@example.com', password: 'password123' };
      const authPayload = { token: 'new-token', user: { id: '2', ...input } };
      mockContext.dataSources.userAPI.registerUser.mockResolvedValue(authPayload);

      const result = await resolvers.Mutation.registerUser(null, { input }, mockContext);

      expect(result).toEqual(authPayload);
      expect(mockContext.dataSources.userAPI.registerUser).toHaveBeenCalledWith(input);
    });

    it('should resolve createProduct mutation for admin and invalidate cache', async () => {
      mockContext.user.role = 'admin';
      const input = { name: 'New Product', price: 9.99, inventory: 100 };
      const product = { id: '1', ...input };
      mockContext.dataSources.productAPI.createProduct.mockResolvedValue(product);

      // Pre-populate cache
      mockContext.cache.set('all_products', [{ id: '2', name: 'Old Product' }]);

      const result = await resolvers.Mutation.createProduct(null, { input }, mockContext);

      expect(result).toEqual(product);
      expect(mockContext.dataSources.productAPI.createProduct).toHaveBeenCalledWith(input);
      expect(mockContext.cache.get('all_products')).toBeUndefined();
    });

    it('should throw error for createProduct mutation for non-admin', async () => {
      const input = { name: 'New Product', price: 9.99, inventory: 100 };

      await expect(resolvers.Mutation.createProduct(null, { input }, mockContext))
        .rejects
        .toThrow(GraphQLError);
    });
  });
});
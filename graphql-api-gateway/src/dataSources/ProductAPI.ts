import { RESTDataSource } from '@apollo/datasource-rest';

export class ProductAPI extends RESTDataSource {
  override baseURL = 'http://product_service:3002/api/products/';

  async createProduct(input: any) {
    return this.post('', { body: input });
  }

  async getAllProducts() {
    return this.get('');
  }

  async getProduct(id: string) {
    return this.get(`${id}`);
  }

  async updateProduct(id: string, input: any) {
    return this.put(`${id}`, { body: input });
  }

  async deleteProduct(id: string) {
    return this.delete(`${id}`);
  }
}
import { RESTDataSource } from '@apollo/datasource-rest';

export class OrderAPI extends RESTDataSource {
  override baseURL = 'http://order_service:3003/api/orders/';

  async createOrder(input: any) {
    return this.post('', { body: input });
  }

  async getAllOrders() {
    return this.get('');
  }

  async getOrder(id: string) {
    return this.get(`${id}`);
  }

  async getUserOrders(userId: string) {
    return this.get(`user/${userId}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.put(`${id}/status`, { body: { status } });
  }
}
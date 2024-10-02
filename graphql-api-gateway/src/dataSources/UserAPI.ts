import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  override baseURL = 'http://user_service:3001/api/users/';

  async registerUser(input: any) {
    return this.post('register', { body: input });
  }

  async loginUser(input: any) {
    return this.post('login', { body: input });
  }

  async updateUserProfile(input: any, token: string) {
    return this.put('profile', { 
      body: input,
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async getUserProfile(token: string) {
    return this.get('profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

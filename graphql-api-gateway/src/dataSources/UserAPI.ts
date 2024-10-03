import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  override baseURL = 'http://user_service:3001/api/';

  async registerUser(input: { username: string; email: string; password: string }) {
    console.log('Sending registration request to user service:', { ...input, password: '[REDACTED]' });
    try {
      const response = await this.post<{ message: string; user: any }>(
        'users/register',
        {
          ...input,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Received response from user service:', response);
      return response;
    } catch (error) {
      console.error('Error in registerUser:', error);
      throw error;
    }
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

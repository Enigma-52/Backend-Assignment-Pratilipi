export interface IUser {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface IUserInput {
    email: string;
    password: string;
  }
  
  export interface IUserOutput {
    id: string;
    email: string;
  }
  
  export interface IAuthToken {
    userId: string;
  }
export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface IUserInput {
  username: string;
  email: string;
  password: string;
}

export interface IUserProfile {
  id: string;
  username: string;
  email: string;
}
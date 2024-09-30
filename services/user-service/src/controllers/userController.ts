import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { IUserInput, IAuthToken } from '../types/user';

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const userData: IUserInput = req.body;
      const user = await UserService.registerUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await UserService.authenticateUser(email, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req.user as IAuthToken).userId;
      const updatedData: Partial<IUserInput> = req.body;
      const updatedUser = await UserService.updateUserProfile(userId, updatedData);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
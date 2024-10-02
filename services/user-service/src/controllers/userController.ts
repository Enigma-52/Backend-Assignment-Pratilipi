import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { IUserInput } from '../../types/user';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInput: IUserInput = req.body;
    const newUser = await userService.registerUser(userInput);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ message: error || 'Error registering user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(401).json({ message: error || 'Error logging in' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const updateData: Partial<IUserInput> = req.body;
    const updatedUser = await userService.updateUserProfile(userId, updateData);
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(400).json({ message: error || 'Error updating profile' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const userProfile = await userService.getUserProfile(userId);
    res.status(200).json({ user: userProfile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(404).json({ message: error || 'Error fetching profile' });
  }
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUserInput, IUserProfile } from '../../types/user';
import { emitUserRegistered, emitUserProfileUpdated } from '../events/producers/userProducer';

export class UserService {

  async registerUser(userInput: IUserInput): Promise<IUserProfile> {
    const { username, email, password } = userInput;

    // Validate input
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    console.log('Registering user:', { username, email }); // Log input (omit password)

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      console.log('User saved to database');

      const userProfile: IUserProfile = { id: newUser._id.toString(), username: newUser.username, email: newUser.email };
      await emitUserRegistered(userProfile);
      console.log('User registered event emitted');

      return userProfile;
    } catch (error) {
      console.error('Error in registerUser:', error);
      throw new Error('Failed to register user');
    }
  }

  async loginUser(email: string, password: string): Promise<string> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return token;
  }

  async updateUserProfile(userId: string, updateData: Partial<IUserInput>): Promise<IUserProfile> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }

    const userProfile: IUserProfile = { id: updatedUser._id.toString(), username: updatedUser.username, email: updatedUser.email };
    await emitUserProfileUpdated(userProfile);

    return userProfile;
  }

  async getUserProfile(userId: string): Promise<IUserProfile> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { id: user._id.toString(), username: user.username, email: user.email };
  }
}

export const userService = new UserService();
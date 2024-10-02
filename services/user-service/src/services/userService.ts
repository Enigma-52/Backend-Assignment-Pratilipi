import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUserInput, IUserProfile } from '../../types/user';
import { emitUserRegistered, emitUserProfileUpdated } from '../events/producers/userProducer';

export class UserService {

  async registerUser(userInput: IUserInput): Promise<IUserProfile> {
    const { username, email, password } = userInput;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new Error('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const userProfile: IUserProfile = { id: newUser._id, username: newUser.username, email: newUser.email };
    await emitUserRegistered(userProfile);

    return userProfile;
  }

  async loginUser(email: string, password: string): Promise<string> {
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
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      throw new Error('User not found');
    }

    const userProfile: IUserProfile = { id: updatedUser._id, username: updatedUser.username, email: updatedUser.email };
    await emitUserProfileUpdated(userProfile);

    return userProfile;
  }

  async getUserProfile(userId: string): Promise<IUserProfile> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return { id: user._id, username: user.username, email: user.email };
  }
}

export const userService = new UserService();
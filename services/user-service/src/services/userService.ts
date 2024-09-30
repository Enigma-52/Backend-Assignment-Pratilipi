import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { publishUserRegistered, publishUserProfileUpdated } from '../events/producers/userProducer';
import { IUserInput, IUserOutput, IAuthToken } from '../types/user';

const prisma = new PrismaClient();

export class UserService {
  static async registerUser(userData: IUserInput): Promise<IUserOutput> {
    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
      },
    });

    await publishUserRegistered({ id: user.id, email: user.email });

    return { id: user.id, email: user.email };
  }

  static async authenticateUser(email: string, password: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id } as IAuthToken, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
  }

  static async updateUserProfile(userId: string, updatedData: Partial<IUserInput>): Promise<IUserOutput> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    await publishUserProfileUpdated({ id: user.id, email: user.email });

    return { id: user.id, email: user.email };
  }
}
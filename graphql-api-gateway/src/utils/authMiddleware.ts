import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set in the environment variables');
  process.exit(1);
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

export const verifyToken = (token: string): JWTPayload => {
  try {
    if (!token) {
      throw new GraphQLError('No token provided', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new GraphQLError('Invalid token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};

export const authMiddleware = (req: Request): { user: JWTPayload | null } => {
  const token = req.headers.authorization?.replace('Bearer ', '') || '';
  
  if (!token) {
    return { user: null };
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (error) {
    return { user: null };
  }
};
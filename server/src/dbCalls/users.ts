import { prisma } from '../db.js';
import {
  NullablePublicUser,
  NullableUser,
  User,
  UserForCreation,
} from '../domain/User.js';

export async function createUser(
  userForCreation: UserForCreation
): Promise<User> {
  const dbUser = await prisma.user.create({
    data: userForCreation,
  });
  return {
    id: dbUser.id,
    email: dbUser.email,
    hashedPassword: dbUser.hashedPassword,
    isAdmin: dbUser.isAdmin,
  };
}

export async function getUser(userId: number): Promise<NullablePublicUser> {
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!dbUser) {
    return null;
  }
  return {
    id: dbUser.id,
    email: dbUser.email,
    isAdmin: dbUser.isAdmin,
  };
}

export async function getUserByEmail(email: string): Promise<NullableUser> {
  const dbUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!dbUser) {
    return null;
  }
  return {
    id: dbUser.id,
    email: dbUser.email,
    hashedPassword: dbUser.hashedPassword,
    isAdmin: dbUser.isAdmin,
  };
}

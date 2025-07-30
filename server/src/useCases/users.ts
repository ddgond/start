import * as usersDb from '../dbCalls/users.js';
import { PublicUser } from '../domain/User.js';

export async function getUser(userId: number): Promise<PublicUser> {
  const dbUser = await usersDb.getUser(userId);
  if (!dbUser) {
    throw new Error('User not found');
  }
  return dbUser;
}

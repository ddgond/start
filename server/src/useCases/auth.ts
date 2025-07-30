import bcrypt from 'bcrypt';
import { addDays } from 'date-fns';
import jwt from 'jsonwebtoken';
import { z } from 'zod/v4';
import * as refreshTokensDb from '../dbCalls/refreshTokens.js';
import * as usersDb from '../dbCalls/users.js';
import { AuthTokens } from '../domain/Auth.js';
import { env } from '../env.js';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_MINUTES = 15;
export const REFRESH_TOKEN_EXPIRATION_DAYS = 30;
const ACCESS_TOKEN_EXPIRES_IN = `${ACCESS_TOKEN_EXPIRATION_MINUTES}m`;
const REFRESH_TOKEN_EXPIRES_IN = `${REFRESH_TOKEN_EXPIRATION_DAYS}d`;

export async function registerUser(
  email: string,
  password: string
): Promise<AuthTokens> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await usersDb.createUser({
    email,
    hashedPassword,
  });

  return await loginUser(email, password);
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthTokens> {
  const user = await usersDb.getUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  const jti = crypto.randomUUID();
  const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ jti }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  await refreshTokensDb.storeRefreshToken({
    userId: user.id,
    jti,
    expiresAt: addDays(new Date(), REFRESH_TOKEN_EXPIRATION_DAYS),
  });
  return { accessToken, refreshToken };
}

const refreshTokenSchema = z.object({
  jti: z.uuid(),
});

// TODO: delete old refresh tokens in DB via cron job
export async function refreshTokens(
  submittedRefreshToken: string
): Promise<AuthTokens> {
  const verifiedSubmittedRefreshToken = jwt.verify(
    submittedRefreshToken,
    REFRESH_TOKEN_SECRET
  );
  const parsedSubmittedRefreshToken = refreshTokenSchema.parse(
    verifiedSubmittedRefreshToken
  );
  const existingRefreshToken = await refreshTokensDb.getRefreshTokenByJti(
    parsedSubmittedRefreshToken.jti
  );
  if (!existingRefreshToken) {
    throw new Error('Invalid refresh token');
  }
  const jti = crypto.randomUUID();
  const accessToken = jwt.sign(
    { userId: existingRefreshToken.userId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    }
  );
  const refreshToken = jwt.sign({ jti }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  await refreshTokensDb.deleteRefreshTokenByJti(
    parsedSubmittedRefreshToken.jti
  );
  await refreshTokensDb.storeRefreshToken({
    userId: existingRefreshToken.userId,
    jti,
    expiresAt: addDays(new Date(), REFRESH_TOKEN_EXPIRATION_DAYS),
  });
  return { accessToken, refreshToken };
}

export async function invalidateRefreshToken(
  submittedRefreshToken: string
): Promise<void> {
  const verifiedSubmittedRefreshToken = jwt.verify(
    submittedRefreshToken,
    REFRESH_TOKEN_SECRET
  );
  const parsedSubmittedRefreshToken = refreshTokenSchema.parse(
    verifiedSubmittedRefreshToken
  );
  await refreshTokensDb.deleteRefreshTokenByJti(
    parsedSubmittedRefreshToken.jti
  );
}

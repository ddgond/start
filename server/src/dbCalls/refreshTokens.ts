import { prisma } from '../db.js';
import { RefreshToken, RefreshTokenCreationDetails } from '../domain/Auth.js';

export async function storeRefreshToken(
  details: RefreshTokenCreationDetails
): Promise<void> {
  await prisma.refreshToken.create({
    data: {
      userId: details.userId,
      jti: details.jti,
      expiresAt: details.expiresAt,
    },
  });
}

export async function getRefreshTokenByJti(
  jti: string
): Promise<RefreshToken | null> {
  return prisma.refreshToken.findUnique({
    where: {
      jti,
    },
  });
}

export async function deleteRefreshTokenByJti(jti: string): Promise<void> {
  await prisma.refreshToken.delete({
    where: {
      jti,
    },
  });
}

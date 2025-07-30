export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenCreationDetails = {
  userId: number;
  jti: string;
  expiresAt: Date;
};

export type RefreshToken = {
  userId: number;
  jti: string;
};

export type User = {
  id: number;
  email: string;
  hashedPassword: string;
  isAdmin: boolean;
};

export type NullableUser = User | null;

export type PublicUser = {
  id: number;
  email: string;
  isAdmin: boolean;
};

export type NullablePublicUser = PublicUser | null;

export type UserForCreation = {
  email: string;
  hashedPassword: string;
};

export type UserCredentialsSub = {
  id: number;
  userId: string;
  email: string;
  accessToken: string | null;
  expiresIn: string | null;
  createdAt: string;
  updatedAt: string;
};
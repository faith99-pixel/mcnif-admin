import { Prisma } from "@prisma/client";

export interface UserCreateInput {
  userId: string;
  accessToken: string;
  expiresIn: Date;
  email: string;
}

const UserModel = Prisma.validator<Prisma.UserCreateInput>()({
  userId: '',
  accessToken: '',
  expiresIn: '',
  email: '',
});

export type UserCreatePayload = UserCreateInput;

export default UserModel;

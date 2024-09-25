'use server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/AuthOptions';
import { UserCredentialsSub } from '@/app/models/IUser';
import { prisma } from '@/lib/prisma';

export async function fetchUserFromDb(): Promise<
  UserCredentialsSub | null
> {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id as string;
  const email = session?.user.email as string;

  if (!session || session === null) return null;

  // Fetch a user by userId
  const user = await prisma.user.findUnique({
    where: {
      userId: userId,
      email: email,
    },
  });

  return user as unknown as UserCredentialsSub;
}

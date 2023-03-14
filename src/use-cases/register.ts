import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

interface IRegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export async function registerUseCase({
  name,
  email,
  password,
}: IRegisterUseCaseRequest): Promise<void> {
  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.');
  }

  const password_hash = await hash(password, 8);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });
}

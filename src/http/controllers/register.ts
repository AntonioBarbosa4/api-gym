import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';
import { hash } from 'bcryptjs';

export async function register(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (userWithSameEmail) {
    return replay.status(409).send();
  }

  const password_hash = await hash(password, 8);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  });

  return replay.status(201).send();
}

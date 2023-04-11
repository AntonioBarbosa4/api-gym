import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { sign } from 'crypto';

export async function authenticate(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();
    const { user } = await authenticateUseCase.execute({ email, password });

    const token = await replay.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      }
    );
    return replay.status(200).send({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return replay.status(400).send({ message: err.message });
    }

    throw err;
  }
}

import { FastifyRequest, FastifyReply } from 'fastify';

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case';
import { ResourceNotFountError } from '@/use-cases/errors/resource-not-found-error';

export async function profile(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  try {
    const getUserProfileUseCase = makeGetUserProfileUseCase();
    const { user } = await getUserProfileUseCase.execute({
      userId: request.user.sub,
    });
    return replay
      .status(200)
      .send({ user: { ...user, password_hash: undefined } });
  } catch (err) {
    if (err instanceof ResourceNotFountError) {
      return replay.status(409).send({ message: err.message });
    }
    throw err;
  }
}

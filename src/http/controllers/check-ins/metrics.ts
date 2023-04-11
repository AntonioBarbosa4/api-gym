import { FastifyRequest, FastifyReply } from 'fastify';

import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case';

export async function metrics(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const getMetricsUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await getMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return replay.status(200).send({ checkInsCount });
}

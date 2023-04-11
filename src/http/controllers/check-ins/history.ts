import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case';

export async function history(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const checkInsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInsHistoryQuerySchema.parse(request.query);

  const historyCheckInUseCase = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await historyCheckInUseCase.execute({
    userId: request.user.sub,
    page,
  });

  return replay.status(200).send({ checkIns });
}

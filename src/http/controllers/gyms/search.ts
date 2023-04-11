import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';

export async function search(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymsUseCase();
  const { gyms } = await searchGymUseCase.execute({
    query,
    page,
  });

  return replay.status(200).send({ gyms });
}

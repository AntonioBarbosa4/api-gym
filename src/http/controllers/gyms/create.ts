import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';

export async function create(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body);

  const CreateGymUseCase = makeCreateGymUseCase();
  await CreateGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });

  return replay.status(201).send();
}

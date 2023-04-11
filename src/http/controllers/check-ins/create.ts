import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';

export async function create(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
  const { gymId } = createCheckInParamsSchema.parse(request.params);

  try {
    const createCheckInUseCase = makeCheckInUseCase();
    const { checkIn } = await createCheckInUseCase.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return replay.status(201).send(checkIn);
  } catch (err) {
    if (err instanceof MaxDistanceError) {
      return replay.status(400).send({ message: err.message });
    }
    if (err instanceof MaxNumberOfCheckInsError) {
      return replay.status(400).send({ message: err.message });
    }

    throw err;
  }
}

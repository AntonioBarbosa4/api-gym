import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';

export async function nearby(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const NearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = NearbyGymsQuerySchema.parse(request.body);

  const nearbyGymUseCase = makeFetchNearbyGymsUseCase();
  const { gyms } = await nearbyGymUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return replay.status(200).send(gyms);
}

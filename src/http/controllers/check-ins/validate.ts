import { z } from 'zod';
import { FastifyRequest, FastifyReply } from 'fastify';

import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error';
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error';
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error';
import { ResourceNotFountError } from '@/use-cases/errors/resource-not-found-error';

export async function validate(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  try {
    const validateUseCase = makeValidateCheckInUseCase();
    await validateUseCase.execute({
      checkInId,
    });

    return replay.status(204).send();
  } catch (err) {
    if (err instanceof LateCheckInValidationError) {
      return replay.status(400).send({ message: err.message });
    }
    if (err instanceof ResourceNotFountError) {
      return replay.status(404).send({ message: err.message });
    }

    throw err;
  }
}

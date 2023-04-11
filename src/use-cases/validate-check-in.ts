import { CheckIn } from '@prisma/client';
import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFountError } from './errors/resource-not-found-error';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

interface IValidateCheckInUseCaseRequest {
  checkInId: string;
}
interface IValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}
export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFountError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );
    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}

import { Prisma, CheckIn } from '@prisma/client';
import { ICheckInsRepository } from '../check-ins-repository';
import { randomUUID } from 'crypto';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  private checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date() : null,
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }
}

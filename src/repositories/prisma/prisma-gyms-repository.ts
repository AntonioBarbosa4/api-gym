import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, IGymsRepository } from '../gyms-repository';
import { prisma } from '@/lib/prisma';

export class PrismaGymsRepository implements IGymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findFirst({
      where: {
        id,
      },
    });
    return gym;
  }
  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    });
    return gym;
  }
  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gym = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
    return gym;
  }
  async findManyNearby(data: FindManyNearbyParams): Promise<Gym[]> {
    const { latitude, longitude } = data;
    const gyms = await prisma.$queryRaw<Gym[]>`SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10`;

    return gyms;
  }
}

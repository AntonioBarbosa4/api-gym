import { Gym, Prisma } from '@prisma/client';
import { IGymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryGymsRepository implements IGymsRepository {
  private gyms: Gym[] = [];

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      longitude: new Prisma.Decimal(data.longitude.toString()),
      latitude: new Prisma.Decimal(data.latitude.toString()),
      phone: data.phone ?? null,
    };

    this.gyms.push(gym);
    return gym;
  }

  async findById(id: string): Promise<Gym | null> {
    const gym = this.gyms.find((gym) => gym.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }
}

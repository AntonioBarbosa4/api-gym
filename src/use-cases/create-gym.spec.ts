import { describe, it, expect, beforeEach } from 'vitest';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';

let inMemoryGymRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    inMemoryGymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymRepository);
  });

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});

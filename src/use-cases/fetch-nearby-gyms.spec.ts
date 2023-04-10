import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;
describe('Fetch Nearby gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();

    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to fetch nearby gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'Near Gym',
      description: '',
      phone: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });
    await inMemoryGymsRepository.create({
      title: 'Far Gym',
      description: '',
      phone: '',
      latitude: -5.8949674,
      longitude: -42.6366077,
    });

    const { gyms } = await sut.execute({
      userLatitude: -5.9881218,
      userLongitude: -42.5518872,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })]);
  });
});

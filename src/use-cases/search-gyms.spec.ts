import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;
describe('Search gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository();

    sut = new SearchGymsUseCase(inMemoryGymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to fetch for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });
    await inMemoryGymsRepository.create({
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' }),
    ]);
  });
  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: -5.9914981,
        longitude: -42.5558974,
      });
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ]);
  });
});

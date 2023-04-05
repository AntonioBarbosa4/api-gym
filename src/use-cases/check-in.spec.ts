import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error';

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe('Check In Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(
      inMemoryCheckInsRepository,
      inMemoryGymsRepository
    );

    await inMemoryGymsRepository.create({
      id: 'gym-id',
      title: 'JavaScript Gym',
      description: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to create a check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -5.9914981,
      userLongitude: -42.5558974,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -5.9914981,
      userLongitude: -42.5558974,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-id',
        userLatitude: -5.9914981,
        userLongitude: -42.5558974,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });
  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -5.9914981,
      userLongitude: -42.5558974,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-id',
      userLatitude: -5.9914981,
      userLongitude: -42.5558974,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should no be able to check in on distant gym', async () => {
    await inMemoryGymsRepository.create({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      latitude: -5.9914981,
      longitude: -42.5558974,
    });

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-02',
        userLatitude: -5.9881218,
        userLongitude: -42.5518872,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

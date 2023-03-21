import { describe, it, expect } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 8),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it('should not be able to authenticate with wrong email', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it('should not be able to authenticate with wrong password', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUseCase(inMemoryUsersRepository);

    await inMemoryUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 8),
    });

    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123123',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

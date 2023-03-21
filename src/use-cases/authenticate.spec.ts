import { describe, it, expect, beforeEach } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(inMemoryUsersRepository);
  });

  it('should be able to authenticate', async () => {
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
    await expect(
      async () =>
        await sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it('should not be able to authenticate with wrong password', async () => {
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

import request from 'supertest';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Create gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const crateGym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -5.9914981,
        longitude: -42.5558974,
      });

    expect(crateGym.statusCode).toEqual(201);
  });
});

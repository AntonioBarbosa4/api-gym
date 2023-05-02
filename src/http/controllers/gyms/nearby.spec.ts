import request from 'supertest';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -5.8949674,
        longitude: -42.6366077,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'Some description',
        phone: '11999999999',
        latitude: -5.9914981,
        longitude: -42.5558974,
      });
    const nearbyResponse = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -5.9914981,
        longitude: -42.5558974,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(nearbyResponse.statusCode).toEqual(200);
    expect(nearbyResponse.body.gyms).toHaveLength(1);
    expect(nearbyResponse.body.gyms).toEqual([
      expect.objectContaining({
        title: 'TypeScript Gym',
      }),
    ]);
  });
});

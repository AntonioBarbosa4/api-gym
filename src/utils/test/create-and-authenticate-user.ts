import request from 'supertest';
import { FastifyInstance } from 'fastify';
export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johb.doe@email.com',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johb.doe@email.com',
    password: '123456',
  });

  const { token } = authResponse.body;

  return { token };
}
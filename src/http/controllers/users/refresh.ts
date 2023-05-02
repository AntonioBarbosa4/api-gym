import { FastifyRequest, FastifyReply } from 'fastify';

export async function refresh(
  request: FastifyRequest,
  replay: FastifyReply
): Promise<FastifyReply> {
  await request.jwtVerify({
    onlyCookie: true,
  });

  const { role } = request.user;

  const token = await replay.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
      },
    }
  );
  const refreshToken = await replay.jwtSign(
    { role },
    {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d',
      },
    }
  );
  return replay
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token });
}

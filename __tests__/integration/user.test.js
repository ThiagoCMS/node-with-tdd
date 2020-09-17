const request = require('supertest');

const app = require('../../src/app');
const { User } = require('../../src/models');
const truncate = require('../utils/truncate');

describe('user', () => {
  beforeEach(async () => {
    await truncate;
  });

  it('should login', async () => {
    const user = await User.create({
      name: 'Thiago Miranda',
      email: 'contato@thiagomiranda.dev',
      password: '123123',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: user.password,
      });

    const responseContaining = {
      name: user.name,
      email: user.email,
    }

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 'name', 'email');
    expect(response.body).toEqual(expect.objectContaining(responseContaining));
  });
});

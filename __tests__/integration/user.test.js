const request = require('supertest');

const app = require('../../src/app');
const { User, sequelize } = require('../../src/models');
const truncate = require('../utils/truncate');

describe('user', () => {
  beforeEach(async () => {
    await truncate;
  });

  afterAll(async done => {
    sequelize.close()
    done()
  })

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
    expect(response.body).not.toHaveProperty('hash_password', 'created_at', 'updated_at');
    expect(response.body).toEqual(expect.objectContaining(responseContaining));
  });

  it('should not login with incorrect password', async () => {
    const user = await User.create({
      name: 'Thiago Miranda',
      email: 'contato@thiagomiranda.dev',
      password: '123123',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: user.email,
        password: '123456',
      });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ message: 'User not found' });
  });

  it('should not login with incorrect credentials', async () => {
    const user = await User.create({
      name: 'Thiago Miranda',
      email: 'contato@thiagomiranda.dev',
      password: '123123',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: 'contato@thiagomiranda.com',
        password: '123456',
      });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ message: 'User not found' });
  });
});

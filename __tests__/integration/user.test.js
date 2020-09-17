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

  it('should create a user', async () => {
    const user = {
      email: 'contato@thiagomiranda.dev',
      name: 'Thiago Miranda',
      password: '123456',
    };

    const response = await request(app)
      .post('/user')
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({ message: 'User created successfully' });
  });

  it('should not create a user without name', async () => {
    const user = {
      email: 'contato@thiagomiranda.dev',
      password: '123456',
    };

    const response = await request(app)
      .post('/user')
      .send(user);

    expect(response.status).toBe(422);
    expect(response.body).toStrictEqual({ message: `Can't create a user without a name` });
  });

  it('should not create a user without email', async () => {
    const user = {
      name: 'Thiago Miranda',
      password: '123456',
    };

    const response = await request(app)
      .post('/user')
      .send(user);

    expect(response.status).toBe(422);
    expect(response.body).toStrictEqual({ message: `Can't create a user without an email` });
  });

  it('should not create a user without password', async () => {
    const user = {
      email: 'contato@thiagomiranda.dev',
      name: 'Thiago Miranda',
    };

    const response = await request(app)
      .post('/user')
      .send(user);

    expect(response.status).toBe(422);
    expect(response.body).toStrictEqual({ message: `Can't create a user without a password` });
  });
});

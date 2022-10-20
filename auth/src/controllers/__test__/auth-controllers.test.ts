import request from 'supertest';
import { app } from '../../app';

const user = {
  username: 'test user',
  email: 'test@mail.com',
  password: '1qaz2wsx',
};

describe('sign up controller', () => {
  it('should send a POST request to the sign up route with a username, email, password and return a 201', async () => {
    return request(app).post('/api/auth/sign-up').send(user).expect(201);
  });
});

import request from 'supertest';
import { app } from '../../app';

const user = {
  username: 'test user',
  email: 'test@mail.com',
  password: '1qaz2wsx',
};

const invalidEmail = {
  username: 'test user',
  email: 'testmail.com',
  password: '1qaz2wsx',
};

const shortPassword = {
  username: 'test user',
  email: 'test@mail.com',
  password: '1qaz',
};

const signUpRoute = '/api/auth/sign-up';

describe('sign up controller', () => {
  it('should send a POST request to the sign up route with a username, email, password and return a 201', async () => {
    return request(app).post(signUpRoute).send(user).expect(201);
  });
  it('should send a 422 on invalid email', async () => {
    return request(app).post(signUpRoute).send(invalidEmail).expect(500);
  });

  it('should send a 422 on password less than 6 characters', async () => {
    return request(app).post(signUpRoute).send(shortPassword).expect(500);
  });
});

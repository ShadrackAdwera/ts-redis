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
  it('should sends a POST request to the sign up route with a username, email, password and return a 201', async () => {
    return request(app).post(signUpRoute).send(user).expect(201);
  });
  it('should send a 422 on invalid email', async () => {
    return request(app).post(signUpRoute).send(invalidEmail).expect(500);
  });

  it('should send a 422 on password less than 6 characters', async () => {
    return request(app).post(signUpRoute).send(shortPassword).expect(500);
  });

  it('should not allow user sign up with the same email', async () => {
    await request(app).post(signUpRoute).send(user).expect(201);
    await request(app).post(signUpRoute).send(user).expect(500);
  });
  it('should sends a jwt on successful sign up', async () => {
    const response = await request(app)
      .post(signUpRoute)
      .send(user)
      .expect(201);
    expect(response.body.user.token).toBeDefined();
  });
});

describe('login controller', () => {
  /*
    1. Check if user exists - return if they don't
    2. Return if password in invalid
    3. Generate JWT if legit credentials
    */
});
//b
describe('add users controller', () => {
  /*
    1. Check if user exists - return if they do
    2. Publish event
    3. Successful addition of user
    */
});

describe('request password reset controller', () => {
  /*
   1. Return if invalid email is provided
   2. Check if email provided exists in DB, return if not
   3. Generate reset token and return successful response to user
   */
});

describe('reset password controller', () => {
  /*
   1. Return error response if password is too short
   2. Return error response if passwords do not match
   3. Return error response if user is not found 
   4. Return 200 on successful password reset
   */
});

describe('modify user role controller', () => {
  /*
   1. Return error response if user role is not provided
   2. Return error response if role provided is invalid
   3. Return error response if to add a role that the user already has
   4. Publish event on modify role
   5. Return 200 on successful role modification
   */
});

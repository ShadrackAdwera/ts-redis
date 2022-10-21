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
const loginRoute = '/api/auth/login';

describe('sign up controller', () => {
  it('should sends a POST request to the sign up route with a username, email, password and return a 201', async () => {
    return request(app).post(signUpRoute).send(user).expect(201);
  });
  it('should send a 422 on invalid email', async () => {
    return request(app).post(signUpRoute).send(invalidEmail).expect(422);
  });

  it('should send a 422 on password less than 6 characters', async () => {
    return request(app).post(signUpRoute).send(shortPassword).expect(422);
  });

  it('should not allow user sign up with the same email', async () => {
    await request(app).post(signUpRoute).send(user).expect(201);
    await request(app).post(signUpRoute).send(user).expect(400);
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
  beforeEach(async () => {
    await request(app).post(signUpRoute).send(user).expect(201);
  });
  it('should return with a 400 if email does not exist', async () => {
    await request(app)
      .post(loginRoute)
      .send({ email: 'testings@mail.com', password: '12345678' })
      .expect(404);
  });
  it('should return 422 for invalid password', async () => {
    await request(app)
      .post(loginRoute)
      .send({ email: user.email, password: '123456789' })
      .expect(422);
  });
  it('should login successfully on valid email + password combo', async () => {
    //await request(app).post(signUpRoute).send(user).expect(201);
    await global.login();
    //await request(app).post(loginRoute).send(user).expect(200);
  });
});
describe('add users controller', () => {
  it.todo('should return a 400 if email exists in DB');
  it.todo('should publish an event successfully');
  it.todo('should return a 201 on successful addition of a user');
  /*
    1. Check if user exists - return if they do
    2. Publish event
    3. Successful addition of user
    */
});

describe('request password reset controller', () => {
  it.todo('return return a 422 if invalid email is provided');
  it.todo('return 404 if the account does not exist');
  it.todo('return 201 on successful user creation');
  /*
   1. Return if invalid email is provided
   2. Check if email provided exists in DB, return if not
   3. Generate reset token and return successful response to user
   */
});

describe('reset password controller', () => {
  it.todo('return 422 if password provided is too short');
  it.todo('return 422 if passwords provided do not match');
  it.todo('return 400 if for some reason account is not found');
  it.todo('return 200 on successful password reset');
  /*
   1. Return error response if password is too short
   2. Return error response if passwords do not match
   3. Return error response if user is not found 
   4. Return 200 on successful password reset
   */
});

describe('modify user role controller', () => {
  it.todo('return 422 when an invalid role is provided');
  it.todo('return 404 if user does not exist');
  it.todo('return 400 if user has the role provided already');
  it.todo('successfully publish event');
  it.todo('return 200 if role modified successfully');
  /*
   1. Return error response if user role is not provided
   2. Return error response if role provided is invalid
   3. Return error response if to add a role that the user already has
   4. Publish event on modify role
   5. Return 200 on successful role modification
   */
});

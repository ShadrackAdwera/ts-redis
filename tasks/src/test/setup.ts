import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var login: () => string;
}

let mongo: MongoMemoryServer;
const user = {
  username: 'test user',
  email: 'test@mail.com',
  password: '1qaz2wsx',
};

jest.setTimeout(300000);
beforeAll(async () => {
  process.env.JWT_KEY = '=6:$}/N7Hp21HrX[bCiI`xj49xi,_';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.login = () => {
  //await await request(app).post(signUpRoute).send(user).expect(201);
  // const response = await request(app).post(loginRoute).send(user).expect(200);
  // return response.body.user.token;
  const payload = { id: '5tlmaslco2laa', email: 'test@mail.com' };
  return jwt.sign(payload, process.env.JWT_KEY!);
};

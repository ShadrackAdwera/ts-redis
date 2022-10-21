import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

//import { app } from '../app';

// declare global {
//   var signin: () => Promise<string[]>;
// }

let mongo: MongoMemoryServer;

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

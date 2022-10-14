import mongoose from 'mongoose';
import { initRedis } from '../init-redis';

const exec: {
  (): Promise<any>;
  (callback?: mongoose.Callback<any> | undefined): void;
  (callback?: mongoose.Callback<any> | undefined): any;
} = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  const objKey = Object.assign({}, this.getQuery(), {
    collection: this.model.collection.collectionName,
  });
  const key = JSON.stringify(objKey);
  const cacheVal = await initRedis.client.get(key);

  if (cacheVal) {
    const doc = JSON.parse(cacheVal);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this);
  await initRedis.client.set(key, JSON.stringify(result));
  return result;
};

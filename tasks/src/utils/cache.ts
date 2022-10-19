import mongoose from 'mongoose';
import { initRedis } from '../init-redis';

const exec: {
  (): Promise<any>;
  (callback?: mongoose.Callback<any> | undefined): void;
  (callback?: mongoose.Callback<any> | undefined): any;
} = mongoose.Query.prototype.exec;

declare module 'mongoose' {
  interface DocumentQuery<
    T,
    DocType extends import('mongoose').Document,
    QueryHelpers = {}
  > {
    mongooseCollection: {
      name: any;
    };
    cache(): DocumentQuery<T[], Document> & QueryHelpers;
    useCache: boolean;
    hashKey: string;
  }

  interface Query<ResultType, DocType, THelpers = {}, RawDocType = DocType>
    extends DocumentQuery<any, any> {}
}

type CacheOptions = { key?: string };

mongoose.Query.prototype.cache = function (options: CacheOptions = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this);
  }

  const objKey = Object.assign({}, this.getQuery(), {
    collection: this.model.collection.collectionName,
  });
  const key = JSON.stringify(objKey);
  // hGet pulls data out of a nested hash
  const cacheVal = await initRedis.client.hGet(this.hashKey, key);

  if (cacheVal && cacheVal.length > 0) {
    const doc = JSON.parse(cacheVal);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  const result = await exec.apply(this);
  await initRedis.client.hSet(this.hashKey, key, JSON.stringify(result));
  // console.log(result);
  return result;
};

function clearHash(hashKey: string | number): void {
  initRedis.client.del(JSON.stringify(hashKey));
}

export { clearHash };

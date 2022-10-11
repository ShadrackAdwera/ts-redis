import { createClient, RedisClientType } from 'redis';

class RedisClient {
  private _client?: RedisClientType;

  get client() {
    if (!this._client) {
      throw new Error('REDIS must be initialised');
    }
    return this._client;
  }

  connect(): Promise<void> {
    //console.log(url);
    this._client = createClient({
      socket: {
        host: 'ts-redis-service',
        port: 6379,
      },
    });
    return this.client
      .connect()
      .then(() => {
        console.log('Connected to REDIS');
      })
      .catch((error: Error) => console.log(error));
  }
}

export const initRedis = new RedisClient();

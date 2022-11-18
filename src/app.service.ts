import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

let url = process.env.REDIS_URL || 'redis-11687.c261.us-east-1-4.ec2.cloud.redislabs.com:11687'
let username = process.env.REDIS_USERNAME || 'default'
let password = process.env.REDIS_PASSWORD || 'nothing'

let connection = `redis://${username}:${password}@${url}`

@Injectable()
export class AppService {
  private redis: any

  constructor() {
    this.redis = new Redis(connection);
  }

  createUserById(id: string, value: string): any {
    return this.redis.set(`user:${id}`, value);
  }

  updateUserById(id: string, value: string): any {
    return this.redis.get(`user:${id}`, (err, result) => {
      if (err) {
        return err
      } else {
        let record = JSON.parse(result)
        let change = JSON.parse(value)
        let merged = JSON.stringify({ ...record, ...change })
        return this.redis.set(`user:${id}`, merged);
      }
    });
  }

  getUserById(id: string): any {
    return this.redis.get(`user:${id}`, (err, result) => {
      if (err) {
        return err
      } else {
        return result
      }
    });
  }

  connect (fromId: string, toId: string) {
    return 'test'
  }

  getHello(): string {
    return 'Hello World!';
  }
}

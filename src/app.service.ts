import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';

import createUserDto from './create-user.dto'
import updateUserDto from './update-user.dto'

let url = process.env.REDIS_URL || 'redis-11687.c261.us-east-1-4.ec2.cloud.redislabs.com:11687'
let username = process.env.REDIS_USERNAME || 'default'
let password = process.env.REDIS_PASSWORD || 'nothing'

let connection = `redis://${username}:${password}@${url}`

@Injectable()
export class AppService {
  private redis: any

  constructor() {
    // init database
    this.redis = new Redis(connection);
  }

  createUserById(id: string, value: createUserDto): any {
    return this.redis.set(`user:${id}`, value);
  }

  updateUserById(id: string, value: updateUserDto): any {
    return this.redis.get(`user:${id}`, (err, result) => {
      if (err) {
        return err
      } else {
        let original = JSON.parse(result)
        let change = value
        let merged = JSON.stringify({ ...original, ...change })
        return this.redis.set(`user:${id}`, merged);
      }
    });
  }

  getUserById(id: string): any {
    return this.redis.get(`user:${id}`, (err, result) => {
      if (err) {
        return err
      } else {
        return JSON.parse(result)
      }
    });
  }

  initiate (fromUser: any, toUser: any, socketService): any {
    // web socket secure
    let wss = socketService.wss()

    // only expose peer id and user id
    let from = {
      userId: fromUser.id,
      peerId: fromUser.peerId
    }
    let to = {
      userId: toUser.id,
      peerId: toUser.peerId
    }
    let message = { 
      id: uuidv4(),
      from, 
      to
    }
    
    // mailbox
    let event = 'signal';
    let channel1 = fromUser.firebaseId
    let channel2 = toUser.firebaseId
    
    // notify both parties
    wss.trigger(channel1, event, message);
    wss.trigger(channel2, event, message);

    return 'success'
  }

  getHello(): string {
    return 'Hello World!';
  }
}

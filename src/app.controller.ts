import { v4 as uuidv4 } from 'uuid';

import { Controller, Get, Put, Post, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './socket.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly socketService: SocketService
  ) {}

  // @Get('/users')
  // getUsers(): string {
  //   return this.appService.getUsers();
  // }

  @Get('/user/:id')
  getUserById(@Param() params): string {
    return JSON.stringify(
      this.appService.getUserById(params.id)
    );
  }

  @Put('/user/:id')
  updateUserById(@Param() params, @Body() record: any): string {
    record.updatedAt = new Date().toString()
    return JSON.stringify(
      this.appService.updateUserById(params.id, record)
    );
  }

  @Post('/user')
  createUserById(@Body() record: any): string {
    record.id = uuidv4()
    record.checkMark = false
    record.createdAt = new Date().toString()
    return JSON.stringify(
      this.appService.createUserById(record.id, record)
    );
  }

  @Post('/initiate/:fromUserId/return/:toUserId')
  callUserById(@Param() params, @Body() firebase: any): string {
    // TODO: authenticate firebase token in order to prevent spam

    let from = this.appService.getUserById(params.fromUserId)
    let to = this.appService.getUserById(params.toUserId)
    if (from && to) {
      return this.appService.initiate(from, to, this.socketService);
    } else {
      return 'failed'
    }
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

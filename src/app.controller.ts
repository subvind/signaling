import { v4 as uuidv4 } from 'uuid';

import { Controller, ValidationPipe, UsePipes, Query, Get, Put, Post, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './socket.service';

import UserDto from './user.dto'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService, 
    private readonly socketService: SocketService
  ) {}

  @Get('/users')
  async findAllUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('filters') filters: string,
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: 'asc' | 'desc',
  ): Promise<any> {
    // example: /users?page=2&pageSize=50&filters=checkMark:true
    page = page || 1;
    pageSize = pageSize || 100;
    filters = filters || null; // [{ checkMark: true }];
    sortBy = sortBy || null; // 'createdAt';
    sortDirection = sortDirection || 'desc'
    let fs: any[] = JSON.parse(filters)

    return await this.appService.findAllUsers(page, pageSize, fs, sortBy, sortDirection)
  }

  @Get('/users/:id')
  async getUserById(@Param() params): Promise<any> {
    return await this.appService.getUserById(params.id)
  }

  @Put('/users/:id')
  async updateUserById(@Param() params, @Body() record: any): Promise<any> {
    // TODO: authenticate firebase token in order to prevent spam

    // TODO: prevent duplicate usernames

    record.updatedAt = new Date().toISOString()
    return await this.appService.updateUserById(params.id, record)
  }

  @Post('/users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() record: UserDto): Promise<any> {
    record.id = uuidv4()
    record.checkMark = false
    record.createdAt = new Date().toISOString()

    // TODO: prevent duplicate usernames

    return await this.appService.createUser(record)
  }

  @Post('/initiate/:fromUserId/return/:toUserId')
  async callUserById(@Param() params): Promise<string> {
    // TODO: authenticate firebase token in order to prevent spam

    let from = await this.appService.getUserById(params.fromUserId)
    let to = await this.appService.getUserById(params.toUserId)
    if (from && to) {
      return this.appService.initiate(from, to, this.socketService);
    } else {
      return 'failed'
    }
  }

  @Delete('/users/:id')
  async deleteUserById(@Param() params): Promise<any> {
    // TODO: authenticate firebase token in order to prevent spam

    return await this.appService.deleteUserById(params.id)
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

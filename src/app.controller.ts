import { v4 as uuidv4 } from 'uuid';

import { UseGuards, Controller, ValidationPipe, UsePipes, Query, Get, Put, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './socket.service';

import { Roles } from './guards/roles.decorator';
import { AuthenticatedGuard } from './guards/authenticated'

import UserDto from './user.dto'

@Controller()
@UseGuards(AuthenticatedGuard)
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
    // example: /users?page=2&pageSize=50&filters=[{"username":"test"}]
    page = page || 1;
    pageSize = pageSize || 100;
    filters = filters || null; // [{ checkMark: true }];
    sortBy = sortBy || null; // 'createdAt';
    sortDirection = sortDirection || 'desc'
    let fs: any[] = JSON.parse(filters)

    let users = await this.appService.findAllUsers(page, pageSize, fs, sortBy, sortDirection)

    // clean up sensitive information
    for (let user of users) {
      delete user.firebaseId
    }
    
    return users
  }

  @Get('/users/:id')
  async getUserById(@Param() params): Promise<any> {
    let user = await this.appService.getUserById(params.id)
    
    // clean up sensitive information
    delete user.firebaseId

    return user
  }

  @Put('/users/:id')
  @Roles('verifiedEmail', 'registered')
  @HttpCode(HttpStatus.BAD_REQUEST)
  async updateUserById(@Param() params, @Body() record: any): Promise<any> {
    // TODO: permission is granted to the owner only
    
    // prevent duplicate usernames
    // prevent duplicate firebaseIds
    let filters = []
    if (record.username) {
      filters.push({ username: record.username })
    }
    if (record.firebaseId) {
      filters.push({ firebaseId: record.firebaseId })
    }
    const existingUsers = await this.appService.findAllUsers(1, 1, filters, 'createdAt', 'desc');
    if (existingUsers.length) {
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists with that username or firebaseId.',
      };
    }

    // make changes
    record.updatedAt = new Date().toISOString()
    let save = await this.appService.updateUserById(params.id, record)

    return save
  }

  @Post('/users')
  @Roles('verifiedEmail')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.BAD_REQUEST)
  async createUser(@Body() record: UserDto): Promise<any> {
    record.id = uuidv4()
    record.checkMark = false
    record.createdAt = new Date().toISOString()

    // prevent duplicate usernames
    // prevent duplicate firebaseIds
    let filters = []
    if (record.username) {
      filters.push({username: record.username})
    }
    if (record.firebaseId) {
      filters.push({firebaseId: record.firebaseId})
    }
    const existingUsers = await this.appService.findAllUsers(1, 1, filters, 'createdAt', 'desc');
    if (existingUsers.length) {
      throw {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'User already exists with that username or firebaseId.',
      };
    }
    
    // make changes
    let save = await this.appService.createUser(record)

    return save
  }

  @Post('/initiate/:fromUserId/return/:toUserId')
  @Roles('verifiedEmail')
  async callUserById(@Param() params): Promise<string> {
    // TODO: permission is granted to the owner only

    let from = await this.appService.getUserById(params.fromUserId)
    let to = await this.appService.getUserById(params.toUserId)
    if (from && to) {
      return this.appService.initiate(from, to, this.socketService);
    } else {
      return 'failed'
    }
  }

  @Delete('/users/:id')
  @Roles('verifiedEmail')
  async deleteUserById(@Param() params): Promise<any> {
    // TODO: permission is granted to the owner only

    return await this.appService.deleteUserById(params.id)
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

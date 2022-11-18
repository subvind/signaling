import { v4 as uuidv4 } from 'uuid';

import { Controller, Get, Put, Post, Delete, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { connect } from 'http2';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('/users')
  // getUsers(): string {
  //   return this.appService.getUsers();
  // }

  @Get('/user/:id')
  getUserById(@Param() params): string {
    return this.appService.getUserById(params.id);
  }

  @Put('/user/:id')
  updateUserById(@Param() params, @Body() updateUserDto: UpdateUserDto): string {
    let record: any = updateUserDto
    record.updatedAt = new Date().toString()
    let data = JSON.stringify(record)
    return this.appService.updateUserById(params.id, data);
  }

  @Post('/user')
  createUserById(@Body() createUserDto: CreateUserDto): string {
    let record: any = createUserDto
    record.id = uuidv4()
    record.checkMark = false
    record.createdAt = new Date().toString()
    let data = JSON.stringify(record)
    return this.appService.createUserById(record.id, data);
  }

  @Post('/initiate/:fromId/return/:toId')
  callUserById(@Param() params, @Body() firebase: any): string {
    // TODO: authenticate initiate's firebase token
    return this.appService.connect(params.fromId, params.toId);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

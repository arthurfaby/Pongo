import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FriendUsersDto } from './dto/friend_users.dto';
import { ApiBody } from '@nestjs/swagger';
import { FriendUsersService } from './friend_users.service';

@Controller('friend_users')
export class FriendUsersController {
  constructor(private friendUsersService: FriendUsersService) {}

  @Post()
  async create(@Body() friendUsersDto: FriendUsersDto) {
    this.friendUsersService.create(friendUsersDto);
  }

  @Get()
  getStat() {
    return this.friendUsersService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') user_id: number) {
    return this.friendUsersService.findByUserId(user_id);
  }

  @Get(':id1/:id2')
  findOneById(@Param('id1') id1: number, @Param('id2') id2: number) {
    return this.friendUsersService.findByIds(id1, id2);
  }

  @Put()
  @ApiBody({ type: [FriendUsersDto] })
  update(@Body() friendUsersDto: FriendUsersDto) {
    return this.friendUsersService.update(friendUsersDto);
  }

  @Delete(':id1/:id2')
  remove(@Param('id1') id1: number, @Param('id2') id2: number) {
    this.friendUsersService.remove(id1, id2);
  }
}

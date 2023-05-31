import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: UserDto) {
    this.usersService.create(createUserDto);
  }

  @Get()
  getAllUser() {
    return this.usersService.findAll();
  }

  @Get('username/:username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Get('email/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Get(':id')
  findUserById(@Param('id') id: number) {
    return this.usersService.findOneById(id);
  }

  @UseGuards(AuthGuard)
  @Post('updateStatus')
  updateStatus(@Body() status: number, @Request() req) {
    this.updateStatus(req.user.sub, status);
  }

  @UseGuards(AuthGuard)
  @Post('getUser')
  getUser(@Request() req) {
    return this.usersService.getUser(req.user.sub);
  }
  @UseGuards(AuthGuard)
  @Post('2fa')
  toggleDoubleAuth(@Request() req) {
    this.usersService.toggleDoubleAuth(req.user.sub);
  }

  @Put()
  @ApiBody({ type: [UserDto] })
  update(@Body() userDto: UserDto) {
    return this.usersService.update(userDto);
  }

  @Delete(':id')
  removeById(@Param('id') id: number) {
    this.usersService.removeById(id);
  }

  @Delete('username/:username')
  removeByUsername(@Param('username') username: string) {
    this.usersService.removeByUsername(username);
  }

  @UseGuards(AuthGuard)
  @Post('updateProfileByForm')
  updateProfileByForm(@Body() user: UserDto, @Request() req) {
    return this.usersService.updateProfileByForm(req.user.sub, user);
  }
}

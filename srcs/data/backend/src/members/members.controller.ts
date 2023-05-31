import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersDto } from './dto/members.dto';
import { ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('members')
export class MembersController {
  constructor(private MembersService: MembersService) {}

  @Post()
  async create(@Body() createMemberDto: MembersDto) {
    this.MembersService.create(createMemberDto);
  }

  @Get()
  getMember() {
    return this.MembersService.findAll();
  }

  @Get(':id')
  findMany(@Param('id') id: number) {
    return this.MembersService.findManyById(id);
  }

  @Get('user/:user_id')
  findByUserId(@Param('user_id') user_id: number) {
    return this.MembersService.findByUserId(user_id);
  }

  @Get('channel/:channel_id')
  findByChannelId(@Param('channel_id') channel_id: number) {
    return this.MembersService.findByChannelId(channel_id);
  }

  @Get('userChan/:user_id/:channel_id')
  findMember(
    @Param('user_id') user_id: number,
    @Param('channel_id') channel_id: number,
  ) {
    return this.MembersService.findMember(user_id, channel_id);
  }

  @Put()
  @ApiBody({ type: [MembersDto] })
  update(@Body() MembersDto: MembersDto) {
    return this.MembersService.update(MembersDto);
  }

  @Put('mute')
  @ApiBody({ type: [MembersDto] })
  updateMute(@Body() MembersDto: MembersDto) {
    return this.MembersService.updateMute(MembersDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.MembersService.remove(id);
  }
}

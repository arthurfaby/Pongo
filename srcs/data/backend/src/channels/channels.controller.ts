import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsDto } from './dto/channels.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('channels')
export class ChannelsController {
  constructor(private ChannelsService: ChannelsService) {}

  @Post()
  async create(@Body() createChannelDto: ChannelsDto) {
    this.ChannelsService.create(createChannelDto);
  }

  @Post('checkChan')
  checkChan(@Body() data) {
    return this.ChannelsService.checkChan(data.name, data.mode);
  }

  @Post('checkChanExist')
  checkChanExist(@Body() data) {
    return this.ChannelsService.checkChanExist(data.name);
  }

  @Post('checkPassFormat')
  checkPassFormat(@Body() data) {
    return this.ChannelsService.checkPassFormat(data.mode, data.pass);
  }

  @Get()
  getChannel() {
    return this.ChannelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ChannelsService.findOneById(id);
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string) {
    return this.ChannelsService.findOneByName(name);
  }

  @Post('pass')
  checkPass(@Body() data) {
    return this.ChannelsService.checkPass(data.pass, data.channel_id);
  }

  @Get('mode/:mode')
  findByMode(@Param('mode') mode: number) {
    return this.ChannelsService.findByMode(mode);
  }

  @Put()
  @ApiBody({ type: [ChannelsDto] })
  update(@Body() ChannelsDto: ChannelsDto) {
    return this.ChannelsService.update(ChannelsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.ChannelsService.remove(id);
  }
}

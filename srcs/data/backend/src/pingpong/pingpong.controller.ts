import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PingpongService } from './pingpong.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pingpong')
export class PingpongController {
  constructor(private pingpongService: PingpongService) {}

  @Delete(':id')
  deleteGameById(@Param('id') id) {
    return this.pingpongService.deleteGame(id);
  }

  @UseGuards(AuthGuard)
  @Post('create')
  async create(@Request() req, @Body() map) {
    this.pingpongService.createGame(req.user.sub, map);
  }

  @UseGuards(AuthGuard)
  @Post('createPrivateGame')
  async createPrivateGame(@Request() req) {
    this.pingpongService.createPrivateGame(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('join')
  async join(@Request() req, @Body() data) {
    this.pingpongService.joinGame(req.user.sub, data.map);
  }

  @UseGuards(AuthGuard)
  @Post('acceptPrivateGame')
  async acceptPrivateGame(@Body() data: any, @Request() req) {
    this.pingpongService.acceptPrivateGame(data.player1, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('reJoin')
  async reJoin(@Request() req) {
    this.pingpongService.reJoinGame(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('quitGame')
  quitGame(@Request() req) {
    this.pingpongService.handleGameQuit(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('updateGame')
  async updateGame(@Body() data, @Request() req) {
    return await this.pingpongService.UpdatePaddle(data.mouseY, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('user')
  findByUserId(@Request() req) {
    return this.pingpongService.findOneByUSerId(req.user.sub);
  }

  @Get()
  findAll() {
    return this.pingpongService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') game_id: number) {
    return this.pingpongService.findOneByGameId(game_id);
  }

  @UseGuards(AuthGuard)
  @Get('result')
  didIWin(@Request() req) {
    return this.pingpongService.didIWin(req.user.sub);
  }
}

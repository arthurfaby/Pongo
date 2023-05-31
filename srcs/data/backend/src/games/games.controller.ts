import { GamesService } from './games.service';
import { ApiBody } from '@nestjs/swagger';
import { GamesDto } from './dto/games.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  async create(@Body() gameDto: GamesDto) {
    this.gamesService.create(gameDto);
  }

  @Get()
  getStat() {
    return this.gamesService.findAll();
  }

  @Get('user/:id')
  findByUserId(@Param('id') id: number) {
    return this.gamesService.findByUserId(id);
  }

  @Put()
  @ApiBody({ type: [GamesDto] })
  update(@Body() gamesDto: GamesDto) {
    return this.gamesService.update(gamesDto);
  }
}

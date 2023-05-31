import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameCategory } from './game.entity';
import { GamesController } from './games.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [GameCategory]
    )
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}

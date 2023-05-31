import { Module } from '@nestjs/common';
import { PingpongController } from './pingpong.controller';
import { PingpongService } from './pingpong.service';
import { PingpongCategory } from './pingpong.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { GamesModule } from 'src/games/games.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    GamesModule,
    StatsModule,
    TypeOrmModule.forFeature(
      [PingpongCategory]
    ),
  ],
  controllers: [PingpongController],
  providers: [PingpongService]
})
export class PingpongModule {}

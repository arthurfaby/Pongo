import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SchoolStrategy } from './school.strategy';
import { HttpModule } from "@nestjs/axios";
import { StatsModule } from 'src/stats/stats.module';
import { MailingModule } from 'src/mailing/mailing.module';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    UsersModule,
    StatsModule,
    MailingModule,
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, SchoolStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}


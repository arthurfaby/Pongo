import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserCategory } from './users/user.entity';
import { StatsModule } from './stats/stats.module';
import { GamesModule } from './games/games.module';
import { ChannelsModule } from './channels/channels.module';
import { StatCategory } from './stats/stat.entity';
import { GameCategory } from './games/game.entity';
import { MessagesModule } from './messages/messages.module';
import { MessageCategory } from './messages/messages.entity';
import { ChannelCategory } from './channels/channels.entity';
import { BlockedUsersCategory } from './blocked_users/blocked_users.entity';
import { FriendUsersCategory } from './friend_users/friend_users.entity';
import { MemberCategory } from './members/members.entity';
import { BlockedUsersModule } from './blocked_users/blocked_users.module';
import { FriendUsersModule } from './friend_users/friend_users.module';
import { MembersModule } from './members/members.module';
import { PingpongModule } from './pingpong/pingpong.module';
import { AuthModule } from './auth/auth.module';
import { PingpongCategory } from './pingpong/pingpong.entity';
import { UsersService } from './users/users.service';
import { MailingModule } from './mailing/mailing.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailingModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        StatCategory,
        GameCategory,
        UserCategory,
        ChannelCategory,
        MessageCategory,
        BlockedUsersCategory,
        FriendUsersCategory,
        MemberCategory,
        PingpongCategory,
      ],
      synchronize: true,
    }),
    UsersModule,
    StatsModule,
    GamesModule,
    ChannelsModule,
    MessagesModule,
    BlockedUsersModule,
    FriendUsersModule,
    MembersModule,
    PingpongModule,
    AuthModule,
    MailingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private usersService: UsersService) {
    setInterval(() => {
      this.usersService.findAll().then((users) => {
        for (let i = 0; i < users.length; ++i) {
          if (users[i].status !== 0) {
            if (
              new Date().getTime() - users[i].last_online_date.getTime() >
              5000
            ) {
              users[i].status = 0;
              this.usersService.update(users[i]);
            }
          }
        }
      });
    }, 1000);
  }
}

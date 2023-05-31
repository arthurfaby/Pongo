import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendUsersCategory } from './friend_users.entity';
import { FriendUsersController } from './friend_users.controller';
import { FriendUsersService } from './friend_users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [FriendUsersCategory]
        )
    ],
    controllers: [FriendUsersController],
    providers: [FriendUsersService]
})
export class FriendUsersModule {}

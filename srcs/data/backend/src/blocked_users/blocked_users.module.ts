import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockedUsersCategory } from './blocked_users.entity';
import { BlockedUsersController } from './blocked_users.controller';
import { BlockedUsersService } from './blocked_users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [BlockedUsersCategory]
        )
    ],
    controllers: [BlockedUsersController],
    providers: [BlockedUsersService]
})
export class BlockedUsersModule {}

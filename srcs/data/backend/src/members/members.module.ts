import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MemberCategory } from './members.entity';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MemberCategory]
        )
    ],
    controllers: [MembersController],
    providers: [MembersService]
})
export class MembersModule {}

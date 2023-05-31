import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageCategory } from './messages.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [MessageCategory]
        )
    ],
    controllers: [MessagesController],
    providers: [MessagesService]
})
export class MessagesModule {}

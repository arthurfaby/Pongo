import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelCategory } from './channels.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ChannelCategory]
        )
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService]
})
export class ChannelsModule {}

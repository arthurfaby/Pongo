import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { StatCategory } from './stat.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [StatCategory]
        )
    ],
    controllers: [StatsController],
    providers: [StatsService],
    exports: [StatsService],
})
export class StatsModule {}

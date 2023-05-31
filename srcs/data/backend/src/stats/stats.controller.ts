import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StatsService } from './stats.service';
import { StatsDto } from './dto/stats.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('stats')
export class StatsController {
    constructor(private statsService: StatsService){}

    @Post()
    async create(@Body() createStatDto: StatsDto){
        this.statsService.create(createStatDto);
    }

    @Get()
    getStats(){
        return this.statsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number){
        return this.statsService.findOneByUserId(id);
    }

    @Put()
    @ApiBody({ type: [StatsDto] })
    update(@Body() statsDto: StatsDto){
        return this.statsService.update(statsDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number){
        this.statsService.remove(id);
    }
}

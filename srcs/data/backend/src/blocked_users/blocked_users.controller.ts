import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BlockedUsersService } from "./blocked_users.service";
import { BlockedUsersDto } from './dto/blocked_users.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('blocked_users')
export class BlockedUsersController {
    constructor(private blockedUsersService: BlockedUsersService){}

    @Post()
    async create(@Body() createBlockedUsersDto: BlockedUsersDto){
        this.blockedUsersService.create(createBlockedUsersDto);
    }

    @Get()
    getStat(){
        return this.blockedUsersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') blockedUsers_id: number){
        return this.blockedUsersService.findOneByUserId(blockedUsers_id);
    }

    @Put()
    @ApiBody({ type: [BlockedUsersDto] })
    update(@Body() blockedUsersDto: BlockedUsersDto){
        return this.blockedUsersService.update(blockedUsersDto);
    }

    @Delete(':id1/:id2')
    remove(@Param('id1') id1: number, @Param('id2') id2: number){
        this.blockedUsersService.remove(id1, id2);
    }
}

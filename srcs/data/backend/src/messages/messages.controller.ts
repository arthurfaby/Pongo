import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { MessagesService } from './messages.service';
import { MessagesDto } from './dto/messages.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('messages')
export class MessagesController {
    constructor(private MessagesService: MessagesService){}

    @Post()
    async create(@Body() createMessageDto: MessagesDto){
        this.MessagesService.create(createMessageDto);
    }

    @Get()
    getMessage(){
        return this.MessagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') channel_id: number){
        return this.MessagesService.findOneByChannelId(channel_id);
    }

    @Post('checkMess')
    checkMess(@Body('mess') mess: string){
        return this.MessagesService.checkMess(mess);
    }

    @Put()
    @ApiBody({ type: [MessagesDto] })
    update(@Body() MessagesDto: MessagesDto){
        return this.MessagesService.update(MessagesDto);
    }

    @Delete(':id')
    remove(@Param('id') message_id: number){
        this.MessagesService.remove(message_id);
    }
}

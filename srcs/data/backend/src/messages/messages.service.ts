import { Injectable } from '@nestjs/common';
import { MessagesDto } from './dto/messages.dto';
import { MessageCategory } from './messages.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageCategory)
    private readonly channelsRepository: Repository<MessageCategory>,
  ) {}

  create(channel: MessageCategory) {
    return this.channelsRepository.insert(channel);
  }

  findAll(): Promise<MessageCategory[]> {
    return this.channelsRepository.find();
  }

  findOneByChannelId(channel_id: number): Promise<MessageCategory[] | null> {
    return this.channelsRepository
      .createQueryBuilder('messages')
      .where('channel_id = :id', { id: channel_id })
      .getMany();
  }

  update(channelsDto: MessagesDto) {
    return this.channelsRepository.save(channelsDto);
  }

  async remove(user_id: number): Promise<void> {
    await this.channelsRepository.delete(user_id);
  }

  checkMess(mess: string) {
    if (mess.length == 0) {
      return 'Message must not be empty';
    } else if (mess.length > 10000) {
      return 'Message length must not exceed 10 000';
    }
    return true;
  }
}

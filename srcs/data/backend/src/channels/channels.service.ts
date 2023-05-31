import { Injectable } from '@nestjs/common';
import { ChannelsDto } from './dto/channels.dto';
import { ChannelCategory } from './channels.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelCategory)
    private readonly channelsRepository: Repository<ChannelCategory>,
  ) {}

  async create(channel: ChannelCategory) {
    if (channel.mode == 1) {
      channel.password = await bcrypt.hash(channel.password, 16);
      return this.channelsRepository.insert(channel);
    }
    return this.channelsRepository.insert(channel);
  }

  async checkPass(pass: string, channel_id: number) {
    const hash: string = (
      await this.channelsRepository.findOneBy({ channel_id })
    ).password;
    const isMatch: boolean = await bcrypt.compare(pass, hash);
    if (!isMatch) {
      return 'Wrong Password';
    }
    return true;
  }

  IsSpace(pass: string) {
    if (pass == pass.replace(/\s+/g, '')) {
      return false;
    }
    return true;
  }

  checkChan(name: string, mode: string) {
    if (name.length == 0) {
      return 'Channel name must not be empty';
    } else if (this.IsSpace(name)) {
      return 'Channel name must not contain spaces';
    } else if (mode != 'public' && mode != 'protected' && mode != 'private') {
      return 'Wrong channel mode';
    }
    return true;
  }

  async checkChanExist(name: string) {
    const data = await this.findAll();
    for (let i = 0; i < data.length; i++) {
      if (data[i].name === name) {
        return 'Channel name already used';
      }
    }
    return true;
  }

  checkPassFormat(mode: string, pass: string) {
    if (mode === 'protected' && pass.length == 0) {
      return 'Password must not be empty';
    }
    return true;
  }

  findAll(): Promise<ChannelCategory[]> {
    return this.channelsRepository.find();
  }

  findOneByName(name: string) {
    return this.channelsRepository
      .createQueryBuilder('name')
      .where('name = :name', { name: name })
      .getOne();
  }

  findByMode(mode: number) {
    return this.channelsRepository
      .createQueryBuilder('mode')
      .where('mode = :mode', { mode: mode })
      .getMany();
  }

  findOneById(channel_id: number): Promise<ChannelCategory | null> {
    return this.channelsRepository.findOneBy({ channel_id });
  }

  update(channelsDto: ChannelsDto) {
    return this.channelsRepository.save(channelsDto);
  }

  async remove(user_id: number): Promise<void> {
    await this.channelsRepository.delete(user_id);
  }
}

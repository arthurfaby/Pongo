import { Injectable } from '@nestjs/common';
import { MembersDto } from './dto/members.dto';
import { MemberCategory } from './members.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(MemberCategory)
    private readonly membersRepository: Repository<MemberCategory>,
  ) {}

  create(member: MembersDto) {
    return this.membersRepository.insert(member);
  }

  findAll(): Promise<MemberCategory[]> {
    return this.membersRepository.find();
  }

  findManyById(user_id: number): Promise<MemberCategory[] | null> {
    return this.membersRepository
      .createQueryBuilder('members')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
  }

  findByUserId(user_id: number): Promise<MemberCategory[] | null> {
    return this.membersRepository
      .createQueryBuilder('userChannels')
      .where('user_id = :user_id', { user_id: user_id })
      .getMany();
  }

  findByChannelId(channel_id: number): Promise<MemberCategory[] | null> {
    return this.membersRepository
      .createQueryBuilder('ChannelsId')
      .where('channel_id = :channel_id', { channel_id: channel_id })
      .getMany();
  }

  findMember(user_id: number, channel_id: number) {
    return this.membersRepository
      .createQueryBuilder('memberId')
      .where('user_id = :user_id', { user_id: user_id })
      .andWhere('channel_id = :channel_id', { channel_id: channel_id })
      .getOne();
  }

  update(member: MembersDto) {
    return this.membersRepository.save(member);
  }

  updateMute(member: MembersDto) {
    if (
      member.mute_time > 2147483647 ||
      member.mute_timestamp_day > 2147483647 ||
      member.mute_timestamp_msec > 2147483647
    ) {
      return 'Mute time exceed integer limit';
    }
    if (member.mute_time < 0) {
      return 'Mute time must be positive';
    }
    return this.update(member);
  }

  async remove(user_id: number): Promise<void> {
    await this.membersRepository.delete(user_id);
  }
}

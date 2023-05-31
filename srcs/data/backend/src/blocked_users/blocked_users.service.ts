import { Injectable } from '@nestjs/common';
import { BlockedUsersDto } from './dto/blocked_users.dto';
import { BlockedUsersCategory } from './blocked_users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BlockedUsersService {
  constructor(
    @InjectRepository(BlockedUsersCategory)
    private readonly blockedUsersRepository: Repository<BlockedUsersCategory>,
  ) {}

  create(blockedUsers: BlockedUsersCategory) {
    return this.blockedUsersRepository.insert(blockedUsers);
  }

  findAll(): Promise<BlockedUsersCategory[]> {
    return this.blockedUsersRepository.find();
  }

  findOneByUserId(user_id: number): Promise<BlockedUsersCategory[] | null> {
    return this.blockedUsersRepository
      .createQueryBuilder('blocked_user')
      .where('user1_id = :id', { id: user_id })
      .getMany();
  }

  update(blockedUsersDto: BlockedUsersDto) {
    return this.blockedUsersRepository.save(blockedUsersDto);
  }

  async remove(id1: number, id2: number): Promise<void> {
    await this.blockedUsersRepository
      .createQueryBuilder('blocked_user_by_ids')
      .delete()
      .where('user1_id = :id1', { id1: id1 })
      .andWhere('user2_id = :id2', { id2: id2 })
      .execute();
  }
}

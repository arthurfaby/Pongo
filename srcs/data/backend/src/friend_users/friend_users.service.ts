import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendUsersDto } from './dto/friend_users.dto';
import { FriendUsersCategory } from './friend_users.entity';

@Injectable()
export class FriendUsersService {
  constructor(
    @InjectRepository(FriendUsersCategory)
    private readonly friendUsersRepository: Repository<FriendUsersCategory>,
  ) {}

  create(friendUsers: FriendUsersCategory) {
    return this.friendUsersRepository.insert(friendUsers);
  }

  findAll(): Promise<FriendUsersCategory[]> {
    return this.friendUsersRepository.find();
  }

  findByUserId(user_id: number): Promise<FriendUsersCategory[] | null> {
    return this.friendUsersRepository
      .createQueryBuilder('friend_user')
      .where('user1_id = :id', { id: user_id })
      .orWhere('user2_id = :id', { id: user_id })
      .getMany();
  }

  findByIds(id1: number, id2: number): Promise<FriendUsersCategory | null> {
    return this.friendUsersRepository
      .createQueryBuilder('friend_user_by_ids')
      .where('user1_id = :id1', { id1: id1 })
      .andWhere('user2_id = :id2', { id2: id2 })
      .getOne();
  }

  update(friendUsersDto: FriendUsersDto) {
    return this.friendUsersRepository.save(friendUsersDto);
  }

  async remove(id1: number, id2: number): Promise<void> {
    await this.friendUsersRepository
      .createQueryBuilder('friend_users')
      .delete()
      .where('user1_id = :id1', { id1: id1 })
      .andWhere('user2_id = :id2', { id2: id2 })
      .execute();
  }
}

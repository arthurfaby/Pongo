import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendUsersCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1_id: number;

  @Column()
  user2_id: number;

  @Column()
  pending: boolean;
}
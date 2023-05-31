import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockedUsersCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user1_id: number;

  @Column()
  user2_id: number;

}
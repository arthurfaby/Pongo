import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MemberCategory {
  @PrimaryGeneratedColumn()
  member_id: number;

  @Column()
  channel_id: number;

  @Column()
  user_id: number;

  @Column()
  user_status: number;

  @Column()
  mute_status: boolean;

  @Column()
  mute_time: number;

  @Column()
  mute_timestamp_day: number;

  @Column()
  mute_timestamp_msec: number;

  @Column()
  ban_status: boolean;
}
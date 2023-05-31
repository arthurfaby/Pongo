import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChannelCategory {
  @PrimaryGeneratedColumn()
  channel_id: number;

  @Column()
  mode: number;

  @Column()
  name: string;

  @Column()
  password: string;
}
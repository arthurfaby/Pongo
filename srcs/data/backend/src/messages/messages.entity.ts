import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageCategory {
  @PrimaryGeneratedColumn()
  message_id: number;

  @Column()
  content: string;

  @Column()
  sender_id: number;

  @Column()
  channel_id: number;
}
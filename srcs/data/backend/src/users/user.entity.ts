import { IsUrl } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @Column()
  status: number;

  @Column()
  last_online_date: Date;
  
  @Column()
  doubleAuth: boolean;

  @Column()
  code: number;

  @Column()
  time: number;
}
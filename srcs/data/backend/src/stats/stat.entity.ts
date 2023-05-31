import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StatCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
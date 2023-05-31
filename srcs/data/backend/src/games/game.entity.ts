import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player1_id: number;

  @Column()
  player2_id: number;

  @Column()
  score_player1: number;

  @Column()
  score_player2: number;

  @Column()
  date: Date;
}
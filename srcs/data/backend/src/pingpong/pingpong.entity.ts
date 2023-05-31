import { Entity, Column, PrimaryGeneratedColumn, Double } from 'typeorm';

@Entity()
export class PingpongCategory {
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
  paddle1X: number;

  @Column()
  paddle1Y: number;

  @Column()
  paddle2X: number;

  @Column()
  paddle2Y: number;

  @Column()
  ballX: number;

  @Column()
  ballY: number;

  @Column()
  ballSpeedX: number;

  @Column()
  ballSpeedY: number;

  @Column()
  ballSide: boolean;

  @Column()
  status: number;

  @Column()
  gameTimer: number;

  @Column()
  timeoutTimer: number;

  @Column()
  timerP1: number;
  
  @Column()
  timerP2: number;

  @Column()
  map: number;
}
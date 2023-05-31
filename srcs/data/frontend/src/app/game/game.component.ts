import { Component, OnDestroy, HostListener } from '@angular/core';
import { GameService } from './game.service';
import { Observable } from 'rxjs';

export class Paddle {
  readonly PADDLE_WIDTH: number = 100;
  readonly PADDLE_THICKNESS: number = 10;

  paddleX: number = 0;
  paddleY: number = 0;
  paddle_dist_from_edge: number = 20;
}

export class Ball {
  ballX: number = 550;
  ballY: number = 850;
  ballSpeedX: number = 10;
  ballSpeedY: number = 10;
  side: boolean = false;
}

@Component({
  selector: 'my-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnDestroy {
  private clearRef: any;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;

  status: number = -1;

  private paddle1: Paddle = new Paddle();
  private paddle2: Paddle = new Paddle();
  private ball: Ball = new Ball();
  private score1: number = 0;
  private score2: number = 0;
  private gameTimer: number = 0;
  private timeoutTimer: number = 0;
  private map: number = 0;
  private mouseY: number = 175;

  constructor(private gameService: GameService) {}

  public ngOnInit(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!this.canvas) {
      return;
    }
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      return;
    }

    const framesPerSecond: number = 30;

    this.drawEmpty();
    this.checkForWaitingGame();

    this.clearRef = setInterval(() => this.updateAll(), 1000 / framesPerSecond);

    this.canvas.addEventListener('mousemove', (event: MouseEvent) =>
      this.updateMousePos(event)
    );
  }

  cancelQueue() {
    this.gameService.findGameByPlayerId().subscribe((data) => {
      if (!data) {
        return;
      }
      if (data.status != 5) {
        return;
      }
      this.gameService.deleteGame(data.id).subscribe((data) => {
        setTimeout(() => {
          this.status = -1;
          this.drawEmpty();
        }, 500);
      });
    });
  }

  checkForWaitingGame() {
    this.gameService.reJoinGame().subscribe();
    this.getUpdate();
  }

  async createGame() {
    this.status = 0;
    await this.gameService.createGame().subscribe();
    this.getUpdate();
  }

  joinGame(map: number) {
    this.status = 0;
    this.gameService.joinGame(map).subscribe();
    this.getUpdate();
  }

  createPrivateGame() {
    this.status = 0;
    this.gameService.createPrivateGame().subscribe();
    this.getUpdate();
  }

  acceptPrivateGame() {
    this.status = 0;
    this.gameService.acceptPrivateGame(1).subscribe();
    this.getUpdate();
  }

  private updateMousePos(event: MouseEvent): void {
    const rect: DOMRect = this.canvas.getBoundingClientRect();
    const root: HTMLElement = document.documentElement;
    this.mouseY =
      ((event.clientY - rect.top) / (rect.bottom - rect.top)) *
      this.canvas.height;
  }

  private updateAll(): void {
    if (this.status == -1) return;
    this.getUpdate();
    if (this.status == 0 || this.status == 5) {
      this.drawEmpty();
      this.ctx!.font = '30px Comic Sans MS';
      this.ctx!.fillStyle = 'red';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText(
        'Waiting for an opponent',
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      return;
    } else if (this.status == 2) {
      this.drawAll();
      this.ctx!.font = '30px Comic Sans MS';
      this.ctx!.fillStyle = 'red';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText(
        this.score1.toString(),
        (this.canvas.width / 12) * 5,
        this.canvas.height / 10
      );
      this.ctx!.fillText(
        this.score2.toString(),
        (this.canvas.width / 12) * 7,
        this.canvas.height / 10
      );
      this.status = -1;
      if (this.score1 == 7 || this.score2 == 7) {
        this.ctx!.fillText(
          this.score1 == 7 ? 'Player 1 won' : 'Player 2 won',
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      } else {
        this.ctx!.fillText(
          'Game ended',
          this.canvas.width / 2,
          this.canvas.height / 2
        );
      }
      setTimeout(() => {
        this.drawEmpty();
      }, 3000);
    } else if (this.status == 3) {
      this.drawAll();
      this.ctx!.font = '30px Comic Sans MS';
      this.ctx!.fillStyle = 'red';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText(
        'Waiting for the other player... ' +
          Math.ceil(this.timeoutTimer / 60).toString(),
        this.canvas.width / 2,
        this.canvas.height / 2
      );
      if (this.timeoutTimer >= 60 * 30 - 100) {
        this.drawEmpty();
        this.status = -1;
      }
    } else if (this.status == 4) {
      this.drawAll();
      this.ctx!.font = '30px Comic Sans MS';
      this.ctx!.fillStyle = 'red';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText(
        Math.ceil(this.gameTimer / 60).toString(),
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    } else {
      this.drawAll();
    }
  }

  private getUpdate() {
    this.gameService.updateGame(this.mouseY).subscribe((data) => {
      if (!data) {
        return;
      }
      this.paddle1.paddleX = data.paddle1X;
      this.paddle1.paddleY = data.paddle1Y;
      this.paddle2.paddleX = data.paddle2X;
      this.paddle2.paddleY = data.paddle2Y;
      this.ball.ballX = data.ballX;
      this.ball.ballY = data.ballY;
      this.ball.ballSpeedX = data.ballSpeedX;
      this.ball.ballSpeedY = data.ballSpeedY;
      this.ball.side = data.ballSide;
      this.status = data.status;
      this.score1 = data.score_player1;
      this.score2 = data.score_player2;
      this.gameTimer = data.gameTimer;
      this.timeoutTimer = data.timeoutTimer;
      this.map = data.map;
    });
  }

  private drawEmpty() {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, 'black');
    this.drawCenter();
  }

  private drawAll(): void {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, 'black');
    this.drawCenter();
    this.drawCircle(this.ball.ballX, this.ball.ballY, 10, 'white');
    this.drawPaddle(this.paddle1);
    this.drawPaddle(this.paddle2);
    if (this.map) {
      this.drawObstacle();
    }
    this.ctx!.font = '30px Comic Sans MS';
    this.ctx!.fillStyle = 'red';
    this.ctx!.textAlign = 'center';
    this.ctx!.fillText(
      this.score1.toString(),
      (this.canvas.width / 12) * 5,
      this.canvas.height / 10
    );
    this.ctx!.fillText(
      this.score2.toString(),
      (this.canvas.width / 12) * 7,
      this.canvas.height / 10
    );
  }

  private drawCenter() {
    for (let i = 0; i < 10; i++) {
      this.drawRect(
        this.canvas.width / 2 - 5,
        15 + (i * this.canvas.height) / 10,
        10,
        25,
        'grey'
      );
    }
  }

  private drawPaddle(paddle: Paddle): void {
    this.drawRect(
      paddle.paddleX,
      paddle.paddleY,
      paddle.PADDLE_THICKNESS,
      paddle.PADDLE_WIDTH,
      'red'
    );
  }

  private drawObstacle(): void {
    this.drawRect(this.canvas.width / 2 - 10, 60, 20, 100, 'green');
    this.drawRect(
      this.canvas.width / 2 - 10,
      this.canvas.height - 100 - 60,
      20,
      100,
      'green'
    );
  }

  private drawRect(
    topLeftX: number,
    topLeftY: number,
    boxWidth: number,
    boxHeight: number,
    fillColor: string
  ): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }

  private drawCircle(
    centerX: number,
    centerY: number,
    radius: number,
    fillColor: any
  ): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    this.ctx.fill();
  }

  @HostListener('window:beforeunload')
  public async ngOnDestroy() {
    if (this.clearRef) {
      clearInterval(this.clearRef);
    }
  }
}

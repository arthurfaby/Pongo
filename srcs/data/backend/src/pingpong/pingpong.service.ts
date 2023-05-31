import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PingpongCategory } from './pingpong.entity';
import { PingpongDto } from './dto/pingpong.dto';
import { Repository } from 'typeorm';
import { GamesDto } from 'src/games/dto/games.dto';
import { GamesService } from 'src/games/games.service';
import { StatsService } from 'src/stats/stats.service';
import { StatsDto } from 'src/stats/dto/stats.dto';
import { UsersService } from 'src/users/users.service';

const clampNumber = (num: number, a: number, b: number) =>
  Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
const RandomSign = (num: number) => (num > 0.5 ? -1 : 1);

/*
game status: 
0 = waiting to find an opponent
1 = currently playing
2 = game finished
3 = waiting for reconnection from a player
4 = timer
5 = private game waiting for opponent
*/

@Injectable()
export class PingpongService implements OnModuleInit {
  private canvas_width = 800;
  private canvas_height = 500;
  readonly PADDLE_WIDTH: number = 100;
  readonly PADDLE_THICKNESS: number = 10;
  readonly PADDLE_DIST_FROM_EDGE: number = 20;
  readonly BASE_SPEED: number = 500;
  readonly FPS: number = 60;
  readonly TIMEOUT: number = this.FPS * 30;
  readonly TIMEOUT_LAG: number = this.FPS;
  readonly MAX_ANGLE: number = Math.PI / 3;

  constructor(
    @InjectRepository(PingpongCategory)
    private readonly pingpongRepository: Repository<PingpongCategory>,
    private gameService: GamesService,
    private statsService: StatsService,
    private userService: UsersService,
  ) {}

  onModuleInit() {
    this.deletedb();
    this.updateGameMovements();
    setInterval(() => {
      this.updateGameMovements();
    }, 1000 / this.FPS);
  }

  async createGame(player1: number, map: number) {
    let currentGame: PingpongDto;
    await this.findOneByUSerId(player1).then(function (res) {
      currentGame = res as PingpongDto;
    });
    if (currentGame) {
      return;
    }
    let game: PingpongDto = new PingpongDto();
    game.ballX = this.canvas_width / 2;
    game.ballY = this.canvas_height / 2;
    game.score_player1 = 0;
    game.score_player2 = 0;
    game.player1_id = player1;
    game.player2_id = -1;
    game.paddle1X = 20;
    game.paddle1Y = 175;
    game.paddle2X = 800 - 30;
    game.paddle2Y = 175;
    game.ballSpeedX = this.BASE_SPEED;
    game.ballSpeedY = 0;
    game.ballSide = true;
    game.status = 0;
    game.gameTimer = 180;
    game.timeoutTimer = 0;
    game.timerP1 = 0;
    game.timerP2 = 0;
    game.map = map;
    return this.pingpongRepository.insert(game);
  }

  async createPrivateGame(player1: number) {
    let currentGame: PingpongDto;
    await this.findOneByUSerId(player1).then(function (res) {
      currentGame = res as PingpongDto;
    });
    if (currentGame) {
      return;
    }
    let game: PingpongDto = new PingpongDto();
    game.ballX = 800 / 2;
    game.ballY = 500 / 2;
    game.score_player1 = 0;
    game.score_player2 = 0;
    game.player1_id = player1;
    game.player2_id = -1;
    game.paddle1X = 20;
    game.paddle1Y = 175;
    game.paddle2X = 800 - 30;
    game.paddle2Y = 175;
    game.ballSpeedX = this.BASE_SPEED;
    game.ballSpeedY = 0;
    game.ballSide = true;
    game.status = 5;
    game.gameTimer = 180;
    game.timeoutTimer = 0;
    game.timerP1 = 0;
    game.timerP2 = 0;
    game.map = 0;
    this.userService.updateStatus(player1, 2);
    return this.pingpongRepository.insert(game);
  }

  async updateGameMovements() {
    let games: PingpongDto[];
    await this.findAllActive().then(function (res) {
      games = res as PingpongDto[];
    });
    if (!games) {
      return;
    }
    this.moveAll(games);
    await this.findAllTimer().then(function (res) {
      games = res as PingpongDto[];
    });
    this.updateTimer(games);
    await this.findAllPaused().then(function (res) {
      games = res as PingpongDto[];
    });
    this.updatePaused(games);
    await this.findAllWaiting().then(function (res) {
      games = res as PingpongDto[];
    });
    this.checkWaiting(games);
  }

  async joinGame(player2: number, map: number) {
    let game: PingpongDto;
    await this.findOneByUSerId(player2).then(function (res) {
      game = res as PingpongDto;
    });
    if (game) {
      return;
    }
    await this.pingpongRepository
      .createQueryBuilder('game')
      .where('player2_id = :player2_id', { player2_id: -1 })
      .where('status = :status', { status: 0 })
      .where('map = :map', { map: map })
      .getOne()
      .then(function (res) {
        game = res as PingpongDto;
      });
    this.userService.updateStatus(player2, 2);
    if (!game) {
      this.createGame(player2, map);
      return;
    } else if (game.player1_id == player2) {
      return;
    }
    game.player2_id = player2;
    game.status = 4;
    this.updateDb(game);
  }

  async acceptPrivateGame(player1: number, player2: number) {
    let game: PingpongDto;
    await this.findOneByUSerId(player2).then(function (res) {
      game = res as PingpongDto;
    });
    if (game) {
      return;
    }
    await this.pingpongRepository
      .createQueryBuilder('game')
      .where('player1_id = :player1_id', { player1_id: player1 })
      .andWhere('status = :status', { status: 5 })
      .getOne()
      .then(function (res) {
        game = res as PingpongDto;
      });
    if (!game) {
      return;
    } else if (game.player1_id == player2) {
      return;
    } else if (game.player2_id != -1) {
      return;
    }
    this.userService.updateStatus(player2, 2);
    game.player2_id = player2;
    game.status = 4;
    this.updateDb(game);
  }

  async reJoinGame(player_id: number) {
    let game: PingpongDto = await this.findOneByUSerId(player_id);
    if (!game) {
      return;
    } else if (game.status != 3) {
      return;
    }
    if (game.timerP1 < 30 && game.timerP2 < 30) {
      this.userService.updateStatus(player_id, 2);
      game.timeoutTimer = 0;
      if (game.gameTimer != 180) {
        game.status = 4;
      } else {
        game.status = 1;
      }
    }
    this.updateDb(game);
  }

  findOneByGameId(id: number): Promise<PingpongCategory> {
    return this.pingpongRepository
      .createQueryBuilder('game')
      .where('id = :id', { id: id })
      .getOne();
  }

  async findAllActive(): Promise<PingpongCategory[]> {
    return await this.pingpongRepository
      .createQueryBuilder('game')
      .where('status = :status', { status: 1 })
      .getMany();
  }

  async findAllWaiting(): Promise<PingpongCategory[]> {
    return await this.pingpongRepository
      .createQueryBuilder('game')
      .where('status = :status', { status: 0 })
      .getMany();
  }

  async findAllTimer(): Promise<PingpongCategory[]> {
    return await this.pingpongRepository
      .createQueryBuilder('game')
      .where('status = :status', { status: 4 })
      .getMany();
  }

  async findAllPaused(): Promise<PingpongCategory[]> {
    return await this.pingpongRepository
      .createQueryBuilder('game')
      .where('status = :status', { status: 3 })
      .getMany();
  }

  async findOneByUSerId(id: number): Promise<PingpongCategory> {
    return await this.pingpongRepository
      .createQueryBuilder('game')
      .where('player1_id = :player1_id', { player1_id: id })
      .orWhere('player2_id = :player2_id', { player2_id: id })
      .getOne();
  }

  findAll(): Promise<PingpongCategory[]> {
    return this.pingpongRepository.find();
  }

  updateDb(pingpongDto: PingpongDto) {
    return this.pingpongRepository.save(pingpongDto);
  }

  async deletedb() {
    return await this.pingpongRepository.clear();
  }

  updateGame2(user_id: number, game: PingpongDto): PingpongDto {
    if (user_id == game.player1_id) {
      game.timerP1 = 0;
    } else {
      game.timerP2 = 0;
    }
    this.updateDb(game);
    return game;
  }

  async updateGame(user_id: number) {
    let game: PingpongDto;
    await this.findOneByUSerId(user_id).then(function (res) {
      game = res as PingpongDto;
    });
    if (!game) {
      return;
    }
    if (user_id == game.player1_id) {
      game.timerP1 = 0;
    } else {
      game.timerP2 = 0;
    }
    this.updateDb(game);
    return game;
  }

  async UpdatePaddle(mouseY: number, user_id: number) {
    let game: PingpongDto;
    await this.findOneByUSerId(user_id).then(function (res) {
      game = res as PingpongDto;
    });
    if (!game) {
      return;
    }
    game = this.updateGame2(user_id, game);
    if (game.status == 0) {
      return game;
    }
    if (user_id == game.player1_id) {
      game.paddle1Y = Math.floor(mouseY);
      if (game.paddle1Y > this.canvas_height - this.PADDLE_WIDTH) {
        game.paddle1Y = this.canvas_height - this.PADDLE_WIDTH;
      }
    } else {
      game.paddle2Y = Math.floor(mouseY);
      if (game.paddle2Y > this.canvas_height - this.PADDLE_WIDTH) {
        game.paddle2Y = this.canvas_height - this.PADDLE_WIDTH;
      }
    }
    return game;
  }

  private resetGame(game: PingpongDto): PingpongDto {
    game.ballX = this.canvas_width / 2;
    game.ballY = this.canvas_height / 2;
    game.paddle1Y = 175;
    game.paddle2Y = 175;
    return game;
  }

  private moveAll(games: PingpongDto[]) {
    games.forEach((game) => {
      if (game.status == 1) {
        game = this.ballMove(game);
        game = this.paddleBrickHandlingLeft(game);
        game = this.paddleBrickHandlingRight(game);
        if (game.map == 1) {
          game = this.handleExpertMap(game);
        }
        game.timerP1++;
        game.timerP2++;
        if (
          game.timerP1 == this.TIMEOUT_LAG ||
          game.timerP2 == this.TIMEOUT_LAG
        ) {
          game.status = 3;
        }
      }
      this.updateDb(game);
    });
  }

  private handleExpertMap(game: PingpongDto): PingpongDto {
    if (
      game.ballY >= 60 &&
      game.ballY <= 60 + 100 &&
      game.ballX >= this.canvas_width / 2 - 15 &&
      game.ballX <= this.canvas_width / 2 + 15 &&
      game.ballX > this.canvas_width / 2 &&
      !game.ballSide
    ) {
      game.ballSpeedX = Math.floor(game.ballSpeedX * -1);
      game.ballSpeedY = Math.floor(game.ballSpeedY);
      game.ballSide = !game.ballSide;
    } else if (
      game.ballY >= 60 &&
      game.ballY <= 60 + 100 &&
      game.ballX >= this.canvas_width / 2 - 15 &&
      game.ballX <= this.canvas_width / 2 + 15 &&
      game.ballX <= this.canvas_width / 2 &&
      game.ballSide
    ) {
      game.ballSpeedX = Math.floor(game.ballSpeedX * -1);
      game.ballSpeedY = Math.floor(game.ballSpeedY);
      game.ballSide = !game.ballSide;
    }
    if (
      game.ballY >= this.canvas_height - 160 &&
      game.ballY <= this.canvas_height - 60 &&
      game.ballX >= this.canvas_width / 2 - 15 &&
      game.ballX <= this.canvas_width / 2 + 15 &&
      game.ballX <= this.canvas_width / 2 &&
      game.ballSide
    ) {
      game.ballSpeedX = Math.floor(game.ballSpeedX * -1);
      game.ballSpeedY = Math.floor(game.ballSpeedY);
      game.ballSide = !game.ballSide;
    } else if (
      game.ballY >= this.canvas_height - 160 &&
      game.ballY <= this.canvas_height - 60 &&
      game.ballX >= this.canvas_width / 2 - 15 &&
      game.ballX <= this.canvas_width / 2 + 15 &&
      game.ballX > this.canvas_width / 2 &&
      !game.ballSide
    ) {
      game.ballSpeedX = Math.floor(game.ballSpeedX * -1);
      game.ballSpeedY = Math.floor(game.ballSpeedY);
      game.ballSide = !game.ballSide;
    }
    return game;
  }

  private updateTimer(games: PingpongDto[]) {
    games.forEach((game) => {
      if (game.gameTimer == 0) {
        game.gameTimer = 180;
        game.status = 1;
      } else {
        game.gameTimer--;
      }
      game.timerP1++;
      game.timerP2++;
      if (
        game.timerP1 == this.TIMEOUT_LAG ||
        game.timerP2 == this.TIMEOUT_LAG
      ) {
        game.status = 3;
      }
      this.updateDb(game);
    });
  }

  private updatePaused(games: PingpongDto[]) {
    games.forEach((game) => {
      game.timeoutTimer++;
      game.timerP1++;
      game.timerP2++;
      if (game.timerP1 < this.TIMEOUT_LAG && game.timerP2 < this.TIMEOUT_LAG) {
        game.timeoutTimer = 0;
        if (game.gameTimer != 180) {
          game.status = 4;
        } else {
          game.status = 1;
        }
      }
      if (
        game.timeoutTimer == this.TIMEOUT ||
        (game.timerP1 > this.TIMEOUT_LAG && game.timerP2 > this.TIMEOUT_LAG)
      ) {
        this.userService.updateStatus(game.player1_id, 1);
        this.userService.updateStatus(game.player2_id, 1);
        this.deleteGame(game.id);
      } else {
        this.updateDb(game);
      }
    });
  }

  private checkWaiting(games: PingpongDto[]) {
    games.forEach((game) => {
      game.timerP1++;
      if (game.timerP1 > this.TIMEOUT_LAG) {
        this.userService.updateStatus(game.player1_id, 1);
        this.userService.updateStatus(game.player2_id, 1);
        this.deleteGame(game.id);
      } else {
        this.updateDb(game);
      }
    });
  }

  private ballMove(game: PingpongDto): PingpongDto {
    game.ballX = Math.floor(game.ballX + game.ballSpeedX / 100);
    game.ballY = Math.floor(game.ballY + game.ballSpeedY / 100);

    if (game.ballX < 5) {
      game.ballSpeedX = -this.BASE_SPEED;
      game.ballSpeedY = 0;
      game.ballSide = false;
      game.score_player2 += 1;
      game.status = 4;
      game = this.resetGame(game);
    } else if (game.ballX > this.canvas_width - 5) {
      game.ballSpeedX = this.BASE_SPEED;
      game.ballSpeedY = 0;
      game.ballSide = true;
      game.score_player1 += 1;
      game.status = 4;
      game = this.resetGame(game);
    } else if (game.ballY < 10 && game.ballSpeedY < 0.0) {
      game.ballSpeedY *= -1;
    } else if (game.ballY > this.canvas_height - 10 && game.ballSpeedY > 0.0) {
      game.ballSpeedY *= -1;
    }
    if (
      game.score_player1 == 7 || game.score_player2 == 7
    ) {
      game.status = 2;
      setTimeout(() => this.deleteGame2(game), 2000);
    }
    return game;
  }

  async deleteGame2(game: PingpongDto) {
    if (!game) return;
    await this.findOneByGameId(game.id).then(function (res) {
      if (!res)
        return;
      let tmp = res as PingpongDto;
      if (tmp.status != 2)
        return;
    });
    this.updateStats(game);
    this.generateHistory(game);
    return this.pingpongRepository.delete(game.id);
  }

  private paddleBrickHandlingLeft(game: PingpongDto): PingpongDto {
    if (
      game.ballY >= game.paddle1Y - 5 &&
      game.ballY <= game.paddle1Y + this.PADDLE_WIDTH + 5 &&
      game.ballX >= this.PADDLE_DIST_FROM_EDGE + 5 &&
      game.ballX <= this.PADDLE_DIST_FROM_EDGE + this.PADDLE_THICKNESS + 5 &&
      game.ballSide == false
    ) {
      const distFromMid: number =
        (game.ballY - game.paddle1Y - this.PADDLE_WIDTH / 2) /
        (this.PADDLE_WIDTH / 2);
      game.ballSpeedX = Math.floor(
        this.BASE_SPEED * Math.cos(this.MAX_ANGLE * distFromMid),
      );
      game.ballSpeedY = Math.floor(
        this.BASE_SPEED * Math.sin(this.MAX_ANGLE * distFromMid),
      );
      game.ballSide = !game.ballSide;
    }
    return game;
  }
  private paddleBrickHandlingRight(game: PingpongDto): PingpongDto {
    if (
      game.ballY >= game.paddle2Y &&
      game.ballY <= game.paddle2Y + this.PADDLE_WIDTH &&
      game.ballX >= game.paddle2X - 5 &&
      game.ballX <= game.paddle2X + this.PADDLE_THICKNESS - 5 &&
      game.ballSide == true
    ) {
      const distFromMid: number =
        (game.ballY - game.paddle2Y - this.PADDLE_WIDTH / 2) /
        (this.PADDLE_WIDTH / 2);
      game.ballSpeedX = Math.floor(
        -this.BASE_SPEED * Math.cos(this.MAX_ANGLE * distFromMid),
      );
      game.ballSpeedY = Math.floor(
        this.BASE_SPEED * Math.sin(this.MAX_ANGLE * distFromMid),
      );
      game.ballSide = !game.ballSide;
    }
    return game;
  }

  generateHistory(game: PingpongDto) {
    let game_history: GamesDto = new GamesDto();
    game_history.date = new Date();
    game_history.player1_id = game.player1_id;
    game_history.player2_id = game.player2_id;
    game_history.score_player1 = game.score_player1;
    game_history.score_player2 = game.score_player2;
    this.gameService.create(game_history);
    this.userService.updateStatus(game.player1_id, 1);
    this.userService.updateStatus(game.player2_id, 1);
    setTimeout(() => this.deleteGame(game.id), 2000);
  }

  async updateStats(game: PingpongDto) {
    let stats: StatsDto;
    await this.statsService
      .findOneByUserId(game.player1_id)
      .then(function (res) {
        stats = res as StatsDto;
      });
    if (!stats) return;
    if (game.score_player1 == 7) {
      stats.wins++;
    } else {
      stats.losses++;
    }
    this.statsService.update(stats);
    await this.statsService
      .findOneByUserId(game.player2_id)
      .then(function (res) {
        stats = res as StatsDto;
      });
    if (!stats) return;
    if (game.score_player2 == 7) {
      stats.wins++;
    } else {
      stats.losses++;
    }
    this.statsService.update(stats);
  }

  deleteGame(id: number) {
    if (!id) return;
    return this.pingpongRepository.delete(id);
  }

  didIWin(user_id: number): number {
    this.findOneByUSerId(user_id).then(function (res) {
      let game: PingpongDto = res as PingpongDto;
      if (user_id == game.player1_id) {
        if (game.score_player1 == 7) {
          return 1;
        }
        return 0;
      } else {
        if (game.score_player2 == 7) {
          return 1;
        }
        return 0;
      }
    });
    return 0;
  }

  async handleGameQuit(user_id: number): Promise<void> {
    let game: PingpongDto;
    await this.findOneByUSerId(user_id).then(function (res) {
      game = res as PingpongDto;
    });
    if (!game) {
      return;
    } else if (game.status == 0 || game.status == 5) {
      this.userService.updateStatus(game.player1_id, 1);
      this.userService.updateStatus(game.player2_id, 1);
      this.pingpongRepository.delete(game.id);
    } else if (game.status == 1 || game.status == 4) {
      game.status = 3;
      this.updateDb(game);
    } else if (game.status == 3) {
      this.deleteGame(game.id);
    }
  }
}

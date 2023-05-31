export class PingpongDto {
    id: number;
    player1_id: number;
    player2_id: number;
    score_player1: number;
    score_player2: number;
    paddle1X: number;
    paddle1Y: number;
    paddle2X: number;
    paddle2Y: number;
    ballX: number;
    ballY: number;
    ballSpeedX: number;
    ballSpeedY: number;
    ballSide: boolean;
    status: number;
    gameTimer: number;
    timeoutTimer: number;
    timerP1: number;
    timerP2: number;
    map: number;
}
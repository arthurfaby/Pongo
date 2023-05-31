import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private httpclient: HttpClient) {}

  findGameByPlayerId() {
    return this.httpclient
      .post<any>(`http://localhost:3000/pingpong/user`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  deleteGame(game_id: number) {
    return this.httpclient
      .delete(`http://localhost:3000/pingpong/${game_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  createGame() {
    return this.httpclient
      .post<null>(`http://localhost:3000/pingpong/create`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  joinGame(map: number) {
    return this.httpclient
      .post<number>(
        `http://localhost:3000/pingpong/join`,
        { map },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') } }
      )
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  createPrivateGame() {
    return this.httpclient
      .post<null>(`http://localhost:3000/pingpong/createPrivateGame`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  acceptPrivateGame(player1: number) {
    return this.httpclient
      .post<null>(
        `http://localhost:3000/pingpong/acceptPrivateGame`,
        { player1: player1 },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') } }
      )
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  reJoinGame() {
    return this.httpclient
      .post<null>(`http://localhost:3000/pingpong/reJoin`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  updateGame(mouseY: number): Observable<any> {
    return this.httpclient
      .post<number>(
        'http://localhost:3000/pingpong/updateGame',
        { mouseY },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') } }
      )
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  didIWin() {
    return this.httpclient
      .get<number>(`http://localhost:3000/pingpong/result`, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }
}

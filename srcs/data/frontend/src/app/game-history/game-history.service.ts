import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameHistoryService {
  constructor(private httpclient: HttpClient) {}

  getHistory(id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/games/user/${id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getUsers() {
    return this.httpclient.get<any>(`http://localhost:3000/users`).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }
}

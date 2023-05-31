import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { StatsInterface } from '../interfaces/stats.interface';

@Injectable({
  providedIn: 'root'
})
export class RankingService {

  constructor(private httpclient: HttpClient) {}

  getRanking(){
    return this.httpclient.get<any>(`http://localhost:3000/stats`)
    .pipe(catchError((err) => {
        return EMPTY;
      })
    );
  }

  getUsers(){
    return this.httpclient.get<any>(`http://localhost:3000/users`)
    .pipe(catchError((err) => {
        return EMPTY;
      })
    );
  }
}
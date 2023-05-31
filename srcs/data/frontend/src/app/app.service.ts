import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from './interfaces/profiles.interface';
import { EMPTY, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private httpclient: HttpClient) {}

  quit() {
    return this.httpclient.put('http://localhost:3000/users', null).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  updateDate(me: UserInterface) {
    me.last_online_date = new Date();
    const new_user: UserInterface = {
      id: me.id,
      last_online_date: me.last_online_date,
    } as UserInterface;
    return this.httpclient.put('http://localhost:3000/users', new_user).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  connect(me: UserInterface) {
    me.status = 1;
    return this.httpclient.put('http://localhost:3000/users', me).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }
}

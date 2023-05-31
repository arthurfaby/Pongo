import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginPageService {
  constructor(private httpclient: HttpClient) { }

  login() {
    return this.httpclient.post<any>(`http://localhost:3000/login`, null, {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
    }).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }
}

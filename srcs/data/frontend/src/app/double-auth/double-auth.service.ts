import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DoubleAuthService {
  constructor(private httpclient: HttpClient) {}

  sendCode(code: number, jwt: string) {
    return this.httpclient
      .post<number>(`http://localhost:3000/auth/doubleAuth`, {
        codepin: code,
        jwt: jwt,
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  sendCode2(code: string, jwt: string): Observable<any> {
    return this.httpclient
      .get<any>(`http://localhost:3000/auth/doubleAuth2`, {
        headers: { codepin: code, jwt: jwt },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }
}

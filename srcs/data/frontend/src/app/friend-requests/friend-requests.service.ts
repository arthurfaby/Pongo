import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FriendUsersInterface } from '../interfaces/friend_users.interface';
import { EMPTY, Observable, catchError } from 'rxjs';
import { UserInterface } from '../interfaces/profiles.interface';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestsService {
  constructor(private httpClient: HttpClient) {}

  getUser() {
    return this.httpClient
      .post<any>(`http://localhost:3000/users/getUser`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getAllRequests(id: number): Observable<FriendUsersInterface[]> {
    return this.httpClient
      .get<FriendUsersInterface[]>('http://localhost:3000/friend_users/user/' + id)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getUserById(id: number) {
    return this.httpClient.get<UserInterface>('http://localhost:3000/users/' + id).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  accept(request: FriendUsersInterface) {
    return this.httpClient
      .put<FriendUsersInterface>('http://localhost:3000/friend_users', request)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  decline(id1: number, id2: number) {
    return this.httpClient.delete('http://localhost:3000/friend_users/' + id1 + '/' + id2).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }
}

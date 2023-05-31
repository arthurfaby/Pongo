import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../interfaces/profiles.interface';
import { EMPTY, Observable, catchError } from 'rxjs';
import { BlockedUsersInterface } from '../interfaces/blocked_users.interface';
import { FriendUsersInterface } from '../interfaces/friend_users.interface';

@Injectable()
export class ProfilesService {
  constructor(private httpClient: HttpClient) { }

  getUsers(): Observable<UserInterface[]> {
    return this.httpClient.get<UserInterface[]>('http://localhost:3000/users').pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  getBlockedUsers(id: number): Observable<BlockedUsersInterface[]> {
    return this.httpClient
      .get<BlockedUsersInterface[]>('http://localhost:3000/blocked_users/' + id)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getFriendUsers(id: number): Observable<FriendUsersInterface[]> {
    return this.httpClient
      .get<FriendUsersInterface[]>('http://localhost:3000/friend_users/user/' + id)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  addFriend(user1_id: number, user2_id: number): void {
    this.httpClient
      .post<any>('http://localhost:3000/friend_users', {
        user1_id: user1_id,
        user2_id: user2_id,
        pending: true,
      }).pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  removeFriend(user1_id: number, user2_id: number): void {
    this.httpClient
      .delete('http://localhost:3000/friend_users/' + user1_id + '/' + user2_id).pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  blockUser(user1_id: number, user2_id: number): void {
    this.httpClient
      .post<any>('http://localhost:3000/blocked_users', {
        user1_id: user1_id,
        user2_id: user2_id,
      }).pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }

  unblockUser(user1_id: number, user2_id: number): void {
    this.httpClient
      .delete('http://localhost:3000/blocked_users/' + user1_id + '/' + user2_id).pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
      .subscribe();
  }
}

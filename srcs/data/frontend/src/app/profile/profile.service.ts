import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatsInterface } from '../interfaces/stats.interface';
import { UserInterface } from '../interfaces/profiles.interface';
import { EMPTY, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getUser() {
    if (localStorage.getItem('JWT') == null) return EMPTY;
    return this.http
      .post<any>(`http://localhost:3000/users/getUser`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getUserByName(username: string) {
    return this.http
      .get<UserInterface>('http://localhost:3000/users/username/' + username)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getStats(id: number) {
    return this.http
      .get<StatsInterface>('http://localhost:3000/stats/' + id)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  toggleDoubleAuth() {
    return this.http
      .post<any>(`http://localhost:3000/users/2fa`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  updateUser(user: UserInterface) {
    return this.http
      .post<UserInterface>(
        'http://localhost:3000/users/updateProfileByForm',
        user,
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
        }
      )
      .pipe(
        catchError((err) => {
          if (err.error.text === 'not an url') {
            this.toastrService.error('Avatar is not a valid url');
          } else if (err.error.text === 'not an image') {
            this.toastrService.error('Avatar is not a valid image');
          } else if (err.error.text === 'username error') {
            this.toastrService.error('Username length is 22 maximum');
          }
          return EMPTY;
        })
      );
  }
}

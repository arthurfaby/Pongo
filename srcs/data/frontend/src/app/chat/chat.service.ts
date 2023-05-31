import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Channel, Member, Message } from './chat.component';
import { EMPTY, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private httpclient: HttpClient,
    private toastrService: ToastrService) { }

  getUser() {
    return this.httpclient
      .post<any>(`http://localhost:3000/users/getUser`, null, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('JWT') },
      })
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

  getMembers(user_id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/members/${user_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getAllMembers() {
    return this.httpclient.get<any>(`http://localhost:3000/members/`).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  getMembersChannel(channel_id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/members/channel/${channel_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getMember(channel_id: number, user_id: number) {
    return this.httpclient
      .get<any>(
        `http://localhost:3000/members/userChan/${user_id}/${channel_id}`
      )
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  deleteMember(member_id: number) {
    return this.httpclient
      .delete<any>(`http://localhost:3000/members/${member_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getChannel(channel_id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/channels/${channel_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getChannelByNameObservable(name: string) {
    return this.httpclient.get<any>(`http://localhost:3000/channels/name/${name}`).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  getChannelByName(name: string): Promise<any> {
    return Promise.resolve(
      this.httpclient.get<any>(`http://localhost:3000/channels/name/${name}`).pipe(
        catchError((err) => {
          return EMPTY;
        })
      )
    );
  }

  getChannels() {
    return this.httpclient.get<any>(`http://localhost:3000/channels`).pipe(
      catchError((err) => {
        return EMPTY;
      })
    );
  }

  getChannelsByMode(mode: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/channels/mode/${mode}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  addChannel(channel: Channel) {
    return this.httpclient
      .post<any>(`http://localhost:3000/channels`, channel)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  addMember(member: Member) {
    return this.httpclient
      .post<any>(`http://localhost:3000/members`, member)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getMessages(channel_id: number | undefined) {
    return this.httpclient
      .get<any>(`http://localhost:3000/messages/${channel_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  addMessage(message: Message) {
    return this.httpclient
      .post<any>(`http://localhost:3000/messages`, message)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  getOneUser(sender_id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/users/${sender_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  checkPass(pass: string, channel_id: number) {
    return this.httpclient
      .post<any>(`http://localhost:3000/channels/pass`, {
        pass: pass,
        channel_id: channel_id,
      })
      .pipe(
        catchError((err) => {
          if (err.error.message === 'Wrong Password') {
            this.toastrService.error('Wrong Password');
          }
          return EMPTY;
        })
      );
  }

  checkMess(mess: string) {
    return this.httpclient
      .post<any>(`http://localhost:3000/messages/checkMess`, { mess })
      .pipe(
        catchError((err) => {
          if (err.error.text === 'Message must not be empty') {
            this.toastrService.error('Message must not be empty');
          } else if (
            err.error.text === 'Message length must not exceed 10 000'
          ) {
            this.toastrService.error('Message length must not exceed 10 000');
          }
          return EMPTY;
        })
      );
  }

  checkChan(name: string, mode: string) {
    return this.httpclient
      .post<any>(`http://localhost:3000/channels/checkChan`, {
        name: name,
        mode: mode,
      })
      .pipe(
        catchError((err) => {
          if (err.error.text === 'Channel name must not be empty') {
            this.toastrService.error('Channel name must not be empty');
          } else if (
            err.error.text === 'Channel name must not contain spaces'
          ) {
            this.toastrService.error('Channel name must not contain spaces');
          } else if (err.error.text === 'Wrong channel mode') {
            this.toastrService.error('Wrong channel mode');
          }
          
          return EMPTY;
        })
      );
  }

  checkChanExist(name: string) {
    return this.httpclient
      .post<any>(`http://localhost:3000/channels/checkChanExist`, {
        name: name,
      })
      .pipe(
        catchError((err) => {
          if (err.error.text === 'Channel name already used') {
            this.toastrService.error('Channel name already used');
          }
          return EMPTY;
        })
      );
  }

  checkPassFormat(mode: string, pass: string) {
    return this.httpclient
      .post<any>(`http://localhost:3000/channels/checkPassFormat`, {
        mode: mode,
        pass: pass,
      })
      .pipe(
        catchError((err) => {
          if (err.error.text === 'Password must not be empty') {
            this.toastrService.error('Password must not be empty');
          }
          return EMPTY;
        })
      );
  }

  getBlocked(user_id: number) {
    return this.httpclient
      .get<any>(`http://localhost:3000/blocked_users/${user_id}`)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  updateChannel(channel: Channel) {
    return this.httpclient
      .put<any>(`http://localhost:3000/channels/`, channel)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  updateMember(member: Member) {
    return this.httpclient
      .put<any>(`http://localhost:3000/members/`, member)
      .pipe(
        catchError((err) => {
          return EMPTY;
        })
      );
  }

  updateMemberMute(member: Member) {
    return this.httpclient
      .put<any>(`http://localhost:3000/members/mute`, member)
      .pipe(
        catchError((err) => {
          if (err.error.text === 'Mute time exceed integer limit') {
            this.toastrService.error('Mute time exceed integer limit');
          } else if (err.error.text === 'Mute time must be positive') {
            this.toastrService.error('Mute time must be positive');
          }
          return EMPTY;
        })
      );
  }
}

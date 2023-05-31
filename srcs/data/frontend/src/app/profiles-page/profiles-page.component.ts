import { Component } from '@angular/core';
import { ProfilesService } from './profiles.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../interfaces/profiles.interface';
import { ProfileService } from '../profile/profile.service';
import { FriendUsersInterface } from '../interfaces/friend_users.interface';
import { ToastrComponentlessModule, ToastrService } from 'ngx-toastr';
import { Channel, Member } from '../chat/chat.component';
import { ChatService } from '../chat/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles-page',
  templateUrl: './profiles-page.component.html',
  styleUrls: ['./profiles-page.component.scss'],
})
export class ProfilesPageComponent {
  [x: string]: any;
  users$!: Observable<UserInterface[]>;
  me!: UserInterface;
  all_users!: UserInterface[];
  blocked_users!: number[];
  friend_users!: FriendUsersInterface[];

  constructor(
    private profilesService: ProfilesService,
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.blocked_users = [];
    this.friend_users = [];
    this.profileService.getUser().subscribe((userValue) => {
      this.me = userValue;
      this.profilesService.getUsers().subscribe((users) => {
        this.all_users = users;
        if (this.all_users) {
          this.all_users.splice(
            this.all_users.findIndex((user) => user.id === this.me.id),
            1
          );
        }
      });
      this.profilesService.getBlockedUsers(this.me.id).subscribe((value) => {
        value.forEach((user) => {
          this.blocked_users.push(user.user2_id);
        });
      });
      this.profilesService.getFriendUsers(this.me.id).subscribe((value) => {
        value.forEach((user) => {
          this.friend_users.push(user);
        });
      });
    });
  }

  isBlocked(id: number): boolean {
    if (!this.blocked_users) return false;
    var res: boolean = false;
    this.blocked_users.forEach((value) => {
      if (value === id) {
        res = true;
      }
    });
    return res;
  }

  friendStatus(id: number): number {
    var res: number = 0;
    var stop: number = 0;
    this.friend_users.forEach((friend) => {
      if (stop === 0) {
        if (
          friend.user1_id === id &&
          friend.user2_id === this.me.id &&
          friend.pending === true
        ) {
          res = 3;
          stop = 1;
        } else if (friend.user1_id === id || friend.user2_id === id) {
          if (friend.pending) {
            res = 2;
            stop = 1;
          } else {
            res = 1;
            stop = 1;
          }
        }
      }
    });
    return res;
  }

  addFriend(user: UserInterface): void {
    const status: number = this.friendStatus(user.id);
    if (status === 0) {
      this.profilesService.addFriend(this.me.id, user.id);
      this.toastrService.success('You have invited ' + user.username);
    } else if (status === 1) {
      this.profilesService.removeFriend(user.id, this.me.id);
      this.profilesService.removeFriend(this.me.id, user.id);
      this.toastrService.success(user.username + ' is no longer your friend.');
    } else if (status === 3) {
      this.toastrService.info(
        'Go to your profile to accept or refuse invitation.'
      );
    } else {
      this.profilesService.removeFriend(this.me.id, user.id);
      this.toastrService.success('Invation canceled.');
    }
    this.ngOnInit();
  }

  blockUser(user: UserInterface): void {
    if (this.isBlocked(user.id)) {
      this.profilesService.unblockUser(this.me.id, user.id);
      this.toastrService.success('You have unblocked ' + user.username);
      this.ngOnInit();
      return;
    }
    this.profilesService.blockUser(this.me.id, user.id);
    this.toastrService.success('You have blocked ' + user.username);
    this.ngOnInit();
  }

  doesMpExist(user1: UserInterface, user2: UserInterface) {
    this.chatService.getMembers(user1.id);
  }

  generateChannelName(user1: UserInterface, user2: UserInterface): string {
    const channel_name: string = 'MP_' + user1.id + '_' + user2.id;
    return channel_name;
  }

  sendMessage(user: UserInterface) {
    const new_channel: Channel = new Channel(
      this.generateChannelName(this.me, user),
      3,
      ''
    );
    this.chatService
      .getChannelByNameObservable(this.generateChannelName(this.me, user))
      .subscribe((chan1) => {
        if (!chan1) {
          this.chatService
            .getChannelByNameObservable(this.generateChannelName(user, this.me))
            .subscribe((chan2) => {
              if (!chan2) {
                this.chatService.addChannel(new_channel).subscribe(() => {
                  setTimeout(() => {
                    this.chatService
                      .getChannelByNameObservable(new_channel.name)
                      .subscribe((chan3: Channel) => {
                        if (!chan3) return;
                        let member1: Member = new Member(
                          chan3.channel_id,
                          this.me.id
                        );
                        let member2: Member = new Member(
                          chan3.channel_id,
                          user.id
                        );
                        this.chatService.addMember(member1).subscribe();
                        this.chatService.addMember(member2).subscribe();
                      });
                  }, 100);
                });
              } else {
                this.router.navigateByUrl('/chat/' + chan2.channel_id);
              }
            });
        } else {
          this.router.navigateByUrl('/chat/' + chan1.channel_id);
        }
      });
  }
}

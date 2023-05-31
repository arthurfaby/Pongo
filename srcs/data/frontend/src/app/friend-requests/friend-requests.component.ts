import { Component } from '@angular/core';
import { FriendUsersInterface } from '../interfaces/friend_users.interface';
import { FriendRequestsService } from './friend-requests.service';
import { UserInterface } from '../interfaces/profiles.interface';
import { ToastrService } from 'ngx-toastr';

interface Request {
  friendRequest: FriendUsersInterface;
  user: UserInterface;
}

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss'],
})
export class FriendRequestsComponent {
  all_requests!: Request[];
  me!: UserInterface;

  constructor(
    private friendRequestsService: FriendRequestsService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.all_requests = [];
    this.friendRequestsService.getUser().subscribe((user) => {
      this.me = user;
      if (this.me) {
        this.friendRequestsService
          .getAllRequests(this.me.id)
          .subscribe((friendRequests) => {
            friendRequests.forEach((friendRequest) => {
              if (
                friendRequest.user2_id === this.me.id &&
                friendRequest.pending === true
              ) {
                this.friendRequestsService
                  .getUserById(friendRequest.user1_id)
                  .subscribe((user) => {
                    this.all_requests.push({
                      friendRequest: friendRequest,
                      user: user,
                    });
                  });
              }
            });
          });
      }
    });
  }

  acceptRequest(request: Request) {
    let new_request: FriendUsersInterface = request.friendRequest;
    new_request.pending = false;
    this.friendRequestsService.accept(new_request).subscribe(() => {
      this.ngOnInit();
    });
    this.toastrService.success(
      'You are now friend with ' + request.user.username + '.'
    );
  }

  declineRequest(request: Request) {
    this.friendRequestsService
      .decline(request.user.id, this.me.id)
      .subscribe(() => {
        this.ngOnInit();
      });
    this.toastrService.success(
      'You decline invitation of ' + request.user.username + '.'
    );
  }
}

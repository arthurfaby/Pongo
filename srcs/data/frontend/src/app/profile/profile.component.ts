import { Component } from '@angular/core';
import { UserInterface } from '../interfaces/profiles.interface';
import { ProfileService } from './profile.service';
import { StatsInterface } from '../interfaces/stats.interface';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FriendRequestsService } from '../friend-requests/friend-requests.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user!: UserInterface;
  stats!: StatsInterface;
  status!: string;
  level_int_part!: number;
  level_dec_part!: number;
  form_visible!: boolean;
  form_username!: string | null;
  form_avatar!: string | null;
  nb_friend_requests!: number;

  constructor(
    private profileService: ProfileService,
    private toastrService: ToastrService,
    private friendRequestsService: FriendRequestsService
  ) {}

  ngOnInit(): void {
    this.form_avatar = '';
    this.form_username = '';
    this.form_visible = false;
    this.nb_friend_requests = 0;
    this.profileService.getUser().subscribe((userValue) => {
      if (!userValue) {
        return;
      }
      this.user = userValue;
      this.profileService.getStats(this.user.id).subscribe((statsValue) => {
        if (!statsValue) {
          return;
        } else {
          this.stats = statsValue;
        }
      });
      this.friendRequestsService
        .getAllRequests(this.user.id)
        .subscribe((value) => {
          value.forEach((fr) => {
            if (fr.user2_id === this.user.id && fr.pending === true) {
              this.nb_friend_requests++;
            }
          });
        });
    });
  }

  toggleDoubleAuth() {
    this.profileService.toggleDoubleAuth().subscribe();
  }

  toggleFormProfile(): void {
    this.form_avatar = '';
    this.form_username = this.user.username;
    this.form_visible = !this.form_visible;
    setTimeout(() => {
      const yes_checkbox: HTMLInputElement = document.getElementById(
        'yes'
      ) as HTMLInputElement;
      const no_checkbox: HTMLInputElement = document.getElementById(
        'no'
      ) as HTMLInputElement;
      if (!yes_checkbox) return;
      if (!no_checkbox) return;
      if (this.user.doubleAuth) {
        yes_checkbox.checked = true;
        no_checkbox.checked = false;
      } else {
        yes_checkbox.checked = false;
        no_checkbox.checked = true;
      }
    }, 50);
  }

  onSubmitForm(form: NgForm): void {
    const new_username: string =
      this.form_username !== '' ? form.value.username : this.user.username;
    const new_avatar: string =
      this.form_avatar !== '' ? form.value.avatar : this.user.avatar;
    const yes_checkbox: HTMLInputElement = document.getElementById(
      'yes'
    ) as HTMLInputElement;
    let status_2fa: boolean;
    if (yes_checkbox.checked) {
      status_2fa = true;
    } else {
      status_2fa = false;
    }
    const new_user: UserInterface = {
      id: this.user.id,
      avatar: new_avatar,
      username: new_username,
      doubleAuth: status_2fa,
    } as UserInterface;
    this.profileService.updateUser(new_user).subscribe(
      (value) => {
        setTimeout(() => {
          this.ngOnInit();
          this.toastrService.success('Modification has been saved.');
        }, 100);
      }
    );
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInterface } from '../interfaces/profiles.interface';
import { StatsInterface } from '../interfaces/stats.interface';
import { ProfileService } from '../profile/profile.service';

@Component({
  selector: 'app-single-profile',
  templateUrl: './single-profile.component.html',
  styleUrls: ['./single-profile.component.scss'],
})
export class SingleProfileComponent {
  username!: string;
  user!: UserInterface;
  stats!: StatsInterface;
  status!: string;
  level_int_part!: number;
  level_dec_part!: number;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    this.profileService.getUserByName(this.username).subscribe((userValue) => {
      if (!userValue) {
        this.router.navigateByUrl('/home');
      }
      this.user = userValue;
      this.profileService.getStats(this.user.id).subscribe((statsValue) => {
        if (!statsValue) {
          this.router.navigateByUrl('/home');
        } else {
          this.stats = statsValue;
        }
      });
    });
  }
}

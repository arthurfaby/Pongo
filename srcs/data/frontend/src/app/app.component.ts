import { Component, HostListener, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription, fromEvent } from 'rxjs';
import { AppService } from './app.service';
import { UserInterface } from './interfaces/profiles.interface';
import { ProfileService } from './profile/profile.service';

export let browserRefresh = false;

export async function resetBrowserRefersh() {
  browserRefresh = false;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  subscription: Subscription;
  title = 'Pongo';
  me!: UserInterface;
  send_date_timer!: ReturnType<typeof setInterval> | null;

  constructor(
    private router: Router,
    private appService: AppService,
    private profileService: ProfileService
  ) {
    this.send_date_timer = null;
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
    this.router.events.subscribe((value) => {
      var ul_navbar: HTMLElement | null = document.getElementById('nav-bar');
      if (!ul_navbar) return;
      ul_navbar.classList.remove('active');
    });
  }

  ngOnInit() {
    this.profileService.getUser().subscribe((me) => {
      this.me = me;
      if (!me) return;
      if (this.me.status !== 2) {
        this.appService.connect(this.me).subscribe();
      }
      this.appService.updateDate(this.me).subscribe();
      if (this.send_date_timer === null) {
        this.send_date_timer = setInterval(() => {
          this.appService.updateDate(this.me).subscribe();
        }, 1000);
      }
    });

    browserRefresh = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.send_date_timer !== null) {
      clearInterval(this.send_date_timer);
    }
  }
}

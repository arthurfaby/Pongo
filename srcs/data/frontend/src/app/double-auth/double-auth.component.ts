import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoubleAuthService } from './double-auth.service';

@Component({
  selector: 'app-double-auth',
  templateUrl: './double-auth.component.html',
  styleUrls: ['./double-auth.component.scss'],
})
export class DoubleAuthComponent {
  codepin: string = '';
  jwt: string = '';
  constructor(
    private router: Router,
    private doubleAuthService: DoubleAuthService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('JWT=')) {
      this.jwt = this.router.url.substring(this.router.url.indexOf('JWT=') + 4);
    }
  }

  sendCode() {
    if (!this.codepin) return;
    let url: string = 'http://localhost:4200/home';
    this.doubleAuthService
      .sendCode2(this.codepin, this.jwt)
      .subscribe((data) => {
        url = data;
        const JWT = url.substring(url.indexOf('JWT=') + 4);
        localStorage.setItem('JWT', JWT);
      });
    this.router.navigateByUrl('/home');
  }
}

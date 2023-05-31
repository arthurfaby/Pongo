import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.includes('JWT')) {
      const JWT = this.router.url.substring(this.router.url.indexOf('JWT') + 3);
      localStorage.setItem('JWT', JWT);
      if (this.router.url.includes('UP=')) {
        if (
          this.router.url.substring(
            this.router.url.indexOf('UP=') + 4,
            this.router.url.indexOf('UP=') + 4 - 1
          ) == '1'
        ) {
          this.router.navigate(['/reload']);
        } else {
          this.router.navigateByUrl('/home');
        }
      }
    }
  }
}

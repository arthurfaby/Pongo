import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit(): void {
    localStorage.removeItem('JWT');
    if (!localStorage.getItem('reload')) {
      localStorage.setItem('reload', 'no reload');
      window.location.reload();
    } else {
      localStorage.removeItem('reload');
    }
    this.router.navigate(['/home']);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent {
  exist = localStorage.getItem('JWT');
  checkLogin!: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.checkLogin = setInterval(() => {
      if (this.exist != localStorage.getItem('JWT')) {
        this.exist = localStorage.getItem('JWT');
        window.location.reload();
      }
    }, 300);

    let hamMenuIcon = document.getElementById('ham-menu');
    if (!hamMenuIcon) return;
    let navBar = document.getElementById('nav-bar');
    if (!navBar) return;
    let navLinks = navBar.querySelectorAll('li');
    hamMenuIcon.addEventListener('click', () => {
      if (!navBar) return;
      if (!hamMenuIcon) return;
      navBar.classList.toggle('active');
      hamMenuIcon.classList.toggle('fa-times');
    });
    navLinks.forEach((navLinks) => {
      navLinks.addEventListener('click', () => {
        if (!navBar) return;
        if (!hamMenuIcon) return;
        navBar.classList.remove('active');
        hamMenuIcon.classList.toggle('fa-times');
      });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.checkLogin);
  }
}

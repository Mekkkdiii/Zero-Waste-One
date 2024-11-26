import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isAdmin: boolean = false;
  isCommunityUser: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkUserRole();
  }

  checkUserRole() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isCommunityUser = localStorage.getItem('isCommunityUser') === 'true';
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

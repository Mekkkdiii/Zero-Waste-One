// app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isCommunityUser: boolean = false;
  currentUserRole: string | null = null;
  title: string = 'ZeroWasteOne';

  constructor(private router: Router) {
    // Subscribe to router events to detect route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
      }
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const userRole = localStorage.getItem('userRole');
    this.isLoggedIn = !!userRole; // true if userRole exists
    this.currentUserRole = userRole;

    // Check if the role is admin or community user
    if (userRole === 'admin') {
      this.isAdmin = true;
      this.isCommunityUser = false;
    } else if (userRole === 'community') {
      this.isCommunityUser = true;
      this.isAdmin = false;
    } else {
      this.isAdmin = false;
      this.isCommunityUser = false;
    }
  }
}
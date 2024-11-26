import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
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
    this.isLoggedIn = !!userRole; // Set isLoggedIn to true if userRole exists
    this.currentUserRole = userRole; // Store current user role
  }
}

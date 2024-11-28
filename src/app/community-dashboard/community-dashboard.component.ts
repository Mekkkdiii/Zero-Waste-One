import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community-dashboard',
  templateUrl: './community-dashboard.component.html',
  styleUrls: ['./community-dashboard.component.css', '../nav/nav.component.css']
})
export class CommunityDashboardComponent implements OnInit {
  userName: string = '';
  communityName: string = '';
  totalPickups: number = 0;
  successfulPickups: number = 0;
  missedPickups: number = 0;

  nextPickup = {
    day: '',
    startTime: '',
    endTime: ''
  };

  recentPickups = [
    { date: '2024-10-18', status: 'Completed' },
    { date: '2024-10-16', status: 'Completed' },
    { date: '2024-10-11', status: 'Missed' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
    this.loadPickupStats();
  }

  loadUserData(): void {
    // Retrieve user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('registeredUser') || '{}');

    // Check if userData is available before accessing its properties
    if (userData) {
      this.userName = userData.fullName || 'Guest';
      this.communityName = userData.community || 'Greenwood Apartments';
    }
  }

  loadPickupStats(): void {
    // Simulated pickup statistics; replace with actual data retrieval logic if needed
    this.totalPickups = 50;  // Example total pickups
    this.successfulPickups = 45; // Example successful pickups
    this.missedPickups = this.totalPickups - this.successfulPickups; // Calculating missed pickups

    // Example next pickup details; replace with actual data if needed
    this.nextPickup.day = 'Wednesday';
    this.nextPickup.startTime = '08:00 AM';
    this.nextPickup.endTime = '10:00 AM';
  }
  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

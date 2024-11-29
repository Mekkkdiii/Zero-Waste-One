import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css', '../nav/nav.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = '';
  communityName: string = '';
  communityAddress: string = '';
  pickupDays: string[] = [];
  pickupStartTime: string = '';
  pickupEndTime: string = '';
  communityExists: boolean = false;

  private apiUrl = 'http://localhost:5001/api/community'; // Replace with your actual API URL

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadAdminData();
    this.loadCommunityData();
  }

  loadAdminData(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID is missing in local storage.');
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    this.adminName = 'Admin'; // Default name for display
  }

  loadCommunityData(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.error('User ID is missing in local storage.');
      this.router.navigate(['/login']); // Redirect to login page
      return;
    }

    // Fetch community data from the server
    this.http.get(`${this.apiUrl}/${userId}`).subscribe(
      (response: any) => {
        if (response && response.community) {
          const community = response.community;
          this.communityName = community.name;
          this.communityAddress = community.address;
          this.pickupDays = community.days;
          this.pickupStartTime = community.startTime;
          this.pickupEndTime = community.endTime;
          this.communityExists = true;
        } else {
          console.warn('No community found for this admin.');
          this.communityExists = false;
        }
      },
      (error) => {
        console.error('Failed to fetch community data:', error);
        this.communityExists = false;
      }
    );
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

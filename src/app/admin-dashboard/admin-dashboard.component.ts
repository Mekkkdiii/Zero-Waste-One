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
    const adminData = JSON.parse(localStorage.getItem('registeredAdmin') || '{}');

    // Check if admin data contains required fields
    if (!adminData || !adminData._id) {
      console.error('Admin ID is missing in local storage.');
      return;
    }

    this.adminName = adminData.fullName || 'Admin';
  }

  loadCommunityData(): void {
    const adminData = JSON.parse(localStorage.getItem('registeredAdmin') || '{}');
  
    if (!adminData || !adminData._id) {
      console.error('Admin ID is missing in local storage.');
      return;
    }
  
    const adminId = adminData._id;
  
    // Fetch community data from the server
    this.http.get(`${this.apiUrl}/${adminId}`).subscribe(
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
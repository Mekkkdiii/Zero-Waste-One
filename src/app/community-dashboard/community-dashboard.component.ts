import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as mongoose from 'mongoose'; // Import mongoose for ObjectId validation

@Component({
  selector: 'app-community-dashboard',
  templateUrl: './community-dashboard.component.html',
  styleUrls: ['./community-dashboard.component.css', '../nav/nav.component.css']
})
export class CommunityDashboardComponent implements OnInit {
  userName: string = '';
  email: string = '';
  communityName: string = '';
  communityAddress: string = '';
  pickupDays: string[] = [];
  pickupStartTime: string = '';
  pickupEndTime: string = '';
  communityExists: boolean = false;

  private apiUrl = 'http://localhost:5001/api/community'; // The endpoint for fetching community details

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Fetch user data using userId
  loadUserData(): void {
    const userId = localStorage.getItem('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      console.error('Invalid userId in local storage.');
      this.router.navigate(['/login']); // Redirect to login if invalid userId
      return;
    }

    this.http.get<any>(`http://localhost:5001/api/user/${userId}`).subscribe(
      (data) => {
        this.userName = data.fullName || 'Guest';
        this.email = data.email;
      },
      (error) => {
        console.error('Failed to load user data:', error);
        alert('Could not fetch user data. Please try again later.');
      }
    );
  }

  // Logout function to clear local storage and redirect to login
  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
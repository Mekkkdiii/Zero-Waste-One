import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = '';
  communityName: string = '';
  communityAddress: string = '';
  pickupDays: string[] = [];
  pickupStartTime: string = '';
  pickupEndTime: string = '';
  communityExists: boolean = false;

  // Static dataset
  private staticCommunityData = {
    name: 'Greenwood Apartments',
    address: '789 Oak Street, Cityville',
    days: ['Wednesday', 'Friday'],
    startTime: '08:00 AM',
    endTime: '10:00 AM'
  };

  ngOnInit(): void {
    this.loadAdminData();
    this.loadCommunityData();
  }

  loadAdminData(): void {
    const adminData = JSON.parse(sessionStorage.getItem('registeredAdmin') || '{}');
    if (adminData) {
      this.adminName = adminData.name || 'Admin';
    }
  }

  loadCommunityData(): void {
    // Use the static dataset for demonstration
    this.communityName = this.staticCommunityData.name;
    this.communityAddress = this.staticCommunityData.address;
    this.pickupDays = this.staticCommunityData.days;
    this.pickupStartTime = this.staticCommunityData.startTime;
    this.pickupEndTime = this.staticCommunityData.endTime;
    this.communityExists = true;
  }
}

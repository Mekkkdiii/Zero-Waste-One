import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-community',
  templateUrl: './create-community.component.html',
  styleUrls: ['./create-community.component.css']
})
export class CreateCommunityComponent {
  communityName: string = '';
  communityAddress: string = '';
  pickupDays: string[] = [];
  pickupStartTime: string = '';
  pickupEndTime: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  availableDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private router: Router, private http: HttpClient) {}
  
  formIsValid(): boolean {
    return (
      this.communityName.trim().length > 0 && // Check if the community name is not empty
      this.communityAddress.trim().length > 0 && // Check if the address is not empty
      this.pickupDays.length > 0 && // Ensure at least one day is selected
      this.pickupStartTime.trim().length > 0 && // Check if start time is not empty
      this.pickupEndTime.trim().length > 0 // Check if end time is not empty
    );
  }
  

  onSubmit() {
    this.successMessage = ''; // Clear previous messages

    if (this.formIsValid()) {
      const adminId = localStorage.getItem('adminId');
      if (!adminId) {
        this.successMessage = 'Unable to create community: Admin ID is missing.';
        return;
      }

      const communityData = {
        name: this.communityName,
        address: this.communityAddress,
        pickupDays: this.pickupDays,
        pickupStartTime: this.pickupStartTime,
        pickupEndTime: this.pickupEndTime,
        createdBy: adminId,
      };

      this.isLoading = true; // Show loader
      this.http.post('http://localhost:5000/api/community/register', communityData).subscribe(
        (response: any) => {
          this.isLoading = false;
          this.successMessage = `Successfully created the community "${this.communityName}" with pickup on ${this.pickupDays.join(
            ', '
          )} from ${this.pickupStartTime} to ${this.pickupEndTime}.`;
          console.log('Community created:', response);

          // Reset form and redirect
          this.communityName = '';
          this.communityAddress = '';
          this.pickupDays = [];
          this.pickupStartTime = '';
          this.pickupEndTime = '';

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          this.isLoading = false;
          console.error('Error creating community:', error);
          this.successMessage = error.error.message || 'There was an error creating the community. Please try again later.';
        }
      );
    }
  }

  onDayChange(event: any, day: string) {
    if (event.target.checked) {
      this.pickupDays.push(day);
    } else {
      const index = this.pickupDays.indexOf(day);
      if (index > -1) {
        this.pickupDays.splice(index, 1);
      }
    }
  }
}
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
  errorMessage: string = '';
  availableDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Admin ID from state or localStorage
  adminId: string | null = null;

  constructor(private router: Router, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.adminId = navigation.extras.state['adminId'];
    } else {
      this.adminId = localStorage.getItem('adminId'); // Fallback if not passed via navigation
    }
  }

  // Handle form submission
  onSubmit() {
    if (
      this.communityName &&
      this.communityAddress &&
      this.pickupDays.length > 0 &&
      this.pickupStartTime &&
      this.pickupEndTime &&
      this.adminId
    ) {
      // Prepare the community data to be sent to the backend
      const communityData = {
        name: this.communityName,
        address: this.communityAddress,
        pickupDays: this.pickupDays,
        pickupStartTime: this.pickupStartTime,
        pickupEndTime: this.pickupEndTime,
        adminId: this.adminId,
      };

      // Send the data to the backend
      this.http.post('http://localhost:5000/api/community/register', communityData).subscribe(
        (response) => {
          this.successMessage = `Successfully created the community "${this.communityName}" with pickup on ${this.pickupDays.join(', ')} from ${this.pickupStartTime} to ${this.pickupEndTime}.`;

          // Redirect to the login page after showing the success message
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000); // 3-second delay to show success message
        },
        (error) => {
          console.error(error);
          this.errorMessage = 'Failed to create the community. Please try again.';
        }
      );
    } else {
      this.errorMessage = 'Please fill out all required fields.';
    }
  }

  // Handle the selection of pickup days
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
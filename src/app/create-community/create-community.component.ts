import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  availableDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private router: Router) {}

  // Handle form submission
  onSubmit() {
    if (
      this.communityName &&
      this.communityAddress &&
      this.pickupDays.length > 0 &&
      this.pickupStartTime &&
      this.pickupEndTime
    ) {
      // Simulate community creation
      this.successMessage = `Successfully created the community "${this.communityName}" with pickup on ${this.pickupDays.join(', ')} from ${this.pickupStartTime} to ${this.pickupEndTime}.`;

      // Prepare the community data to be sent to the Admin Dashboard
      const communityData = {
        name: this.communityName,
        address: this.communityAddress,
        days: this.pickupDays,
        startTime: this.pickupStartTime,
        endTime: this.pickupEndTime,
      };

      // Display the success message briefly, then navigate to the Admin Registration logic
      setTimeout(() => {
        this.router.navigate(['/login']); // Redirect to login page after community creation
      }, 3000); // 3-second delay to show success message
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

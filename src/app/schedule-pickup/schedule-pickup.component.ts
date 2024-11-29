import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.css', '../nav/nav.component.css'],
})
export class SchedulePickupComponent implements OnInit {
  availableDates: string[] = [];
  availableTimes: string[] = [];
  wasteTypes: string[] = ['Household Waste', 'Recyclable Waste', 'Hazardous Waste'];

  selectedDate: string = '';
  selectedTime: string = '';
  selectedWasteType: string = '';
  successMessage: string = ''; // For success messages
  errorMessage: string = ''; // For error messages
  communityId: string = '';
  userId: string = '';
  nextAvailableDate: string = ''; 

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const communityId = localStorage.getItem('communityId');
    console.log('User ID from local storage:', userId);
    console.log('Community ID from local storage:', communityId);

    if (!userId || !communityId) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = userId;
    this.communityId = communityId;

    this.loadCommunityDetails();
  }

  loadCommunityDetails(): void {
    const headers = new HttpHeaders().set('community-id', this.communityId);
  
    this.http.get<any>('http://localhost:5001/api/community', { headers }).subscribe(
      (community) => {
        console.log('Community Details:', community); // Debug pickupDays, startTime, endTime
        this.availableDates = this.getAvailableDates(community.days);
        this.availableTimes = this.getAvailableTimes(community.startTime, community.endTime);
      },
      (error) => {
        console.error('Failed to load community details:', error);
        this.errorMessage = 'Community not found or there was an error fetching the details.';
      }
    );
  }  

  onSubmit(): void {
    if (!this.selectedWasteType) {
      this.errorMessage = 'Please select a waste type.';
      return;
    }
  
    const payload = {
      userId: this.userId,
      communityId: this.communityId,
      pickupType: this.selectedWasteType,
      pickupDate: this.selectedDate,
      pickupTime: this.selectedTime,
    };
  
    console.log('Payload for pickup scheduling:', payload);

    // Format the date using toLocaleDateString
    const formattedDate = new Date(this.selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    this.http.post('http://localhost:5001/api/pickup', payload).subscribe(
      (response: any) => {
        console.log('Pickup successfully scheduled:', response);
  
        const pickupId = response.pickupId; // Get the pickup ID
        console.log('Scheduled Pickup ID:', pickupId);
  
        const broadcastPayload = { userId: this.userId, pickupId };
        this.http.post('http://localhost:5001/api/broadcast-pickup', broadcastPayload).subscribe(
          (broadcastResponse) => {
            console.log('Broadcast sent successfully:', broadcastResponse);
          },
          (broadcastError) => {
            console.error('Error sending broadcast:', broadcastError);
            alert('Pickup scheduled, but reminder notification failed.');
          }
        );
  
        // Set success message
        this.successMessage = `
          Pickup scheduled successfully!<br> 
          Pickup ID: ${pickupId}<br>
          Date: ${formattedDate}<br>
          Time: ${this.selectedTime}<br>
          Waste Type: ${this.selectedWasteType}`;
        this.errorMessage = ''; // Clear any error messages
  
        // Reset form fields
        this.selectedDate = '';
        this.selectedTime = '';
        this.selectedWasteType = '';
      },
      (error) => {
        console.error('Error scheduling pickup:', error);
        this.errorMessage = error.error.message || 'An error occurred while scheduling pickup.';
        this.successMessage = ''; // Clear any success messages
      }
    );
  }  

  getAvailableDates(days: string[]): string[] {
    const dates: string[] = [];
    const today = new Date();
    let foundNextAvailableDate = false;
  
    for (let i = 0; i < 30; i++) {
      const nextDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000); // Adding i days to today
      const dayOfWeek = nextDate.getDay(); // Get numeric day of the week (0 = Sunday, 1 = Monday, ...)
      const dayName = this.getDayName(dayOfWeek); // Convert numeric day to string (e.g., "Monday")
  
      console.log('Checking next date:', nextDate.toISOString(), 'Day name:', dayName);
  
      // Check if the day matches any of the pickup days
      if (days.includes(dayName)) {
        const formattedDate = nextDate.toISOString().split('T')[0]; // Format the date (YYYY-MM-DD)
        dates.push(formattedDate);
  
        if (!foundNextAvailableDate) {
          this.nextAvailableDate = formattedDate; // Set the first available date
          foundNextAvailableDate = true;
        }
      }
    }
  
    console.log('Available Dates:', dates);
    return dates;
  }
  
  getDayName(dayIndex: number): string {
    const daysOfWeek = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return daysOfWeek[dayIndex]; // Matches 'pickupDays' from the backend
  }  

  getAvailableTimes(startTime: string, endTime: string): string[] {
    const times = [];

    let currentTime = this.convertToMinutes(startTime);
    const end = this.convertToMinutes(endTime);

    while (currentTime <= end) {
      times.push(this.convertToTimeFormat(currentTime));
      currentTime += 60;
    }

    return times;
  }

  convertToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map((val) => parseInt(val, 10));
    return hour * 60 + minute;
  }

  convertToTimeFormat(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? '0' + mins : mins}`;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
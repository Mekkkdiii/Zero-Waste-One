import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.css', '../nav/nav.component.css']
})
export class SchedulePickupComponent implements OnInit {
  availableDates: string[] = [];
  availableTimes: string[] = [];
  wasteTypes: string[] = ['Household Waste', 'Recyclable Waste', 'Hazardous Waste'];

  selectedDate: string = '';
  selectedTime: string = '';
  selectedWasteType: string = '';
  confirmationMessage: string = '';
  communityId: string = '';
  userId: string = '';
  nextAvailableDate: string = '';  // Initialize nextAvailableDate here

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
        this.availableDates = this.getAvailableDates(community.days);
        this.availableTimes = this.getAvailableTimes(community.startTime, community.endTime);
      },
      (error) => {
        console.error('Failed to load community details:', error);
        alert('Community not found or there was an error fetching the details.');
      }
    );
  }   

  getAvailableDates(days: string[]): string[] {
    const dates = [];
    const today = new Date();
    let foundNextAvailableDate = false;

    for (let i = 0; i < 30; i++) {
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);

      const dayOfWeek = nextDate.getDay();
      if (days.includes(this.getDayName(dayOfWeek))) {
        const formattedDate = nextDate.toISOString().split('T')[0];
        dates.push(formattedDate);

        // Set the first available date
        if (!foundNextAvailableDate) {
          this.nextAvailableDate = formattedDate; // Set the next available date
          foundNextAvailableDate = true;
        }
      }
    }
    return dates;
  }

  getDayName(dayIndex: number): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  }

  getAvailableTimes(startTime: string, endTime: string): string[] {
    const times = [];
    
    let currentTime = this.convertToMinutes(startTime);  // Convert currentTime to minutes
    const end = this.convertToMinutes(endTime);  // Convert endTime to minutes
  
    // Loop to generate available times
    while (currentTime <= end) {
      times.push(this.convertToTimeFormat(currentTime)); // Convert minutes back to time format
      currentTime += 60; // Add 1 hour (60 minutes) to currentTime
    }
  
    return times;
  }
  
  convertToMinutes(time: string): number {
    const [hour, minute] = time.split(':').map((val) => parseInt(val, 10));
    return hour * 60 + minute;  // Convert time to minutes
  }
  
  convertToTimeFormat(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? '0' + mins : mins}`;  // Convert minutes back to "HH:mm" format
  }
  
  onSubmit(): void {
    if (!this.selectedWasteType) {
      alert('Please select a waste type.');
      return;
    }
  
    const payload = {
      userId: this.userId,
      communityId: this.communityId,
      pickupType: this.selectedWasteType,
      pickupDate: this.selectedDate,
      pickupTime: this.selectedTime
    };
  
    console.log('Payload for pickup scheduling:', payload);
  
    this.http.post('http://localhost:5001/api/pickup', payload).subscribe(
      (response) => {
        console.log('Pickup successfully scheduled:', response);
        this.confirmationMessage = `Pickup scheduled on ${this.selectedDate} at ${this.selectedTime} for ${this.selectedWasteType}.`;
      },
      (error) => {
        console.error('Error scheduling pickup:', error);
        alert(error.error.message || 'An error occurred while scheduling pickup.');
      }
    );
  }  

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

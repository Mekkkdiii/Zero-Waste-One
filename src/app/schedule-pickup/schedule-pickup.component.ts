import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule-pickup',
  templateUrl: './schedule-pickup.component.html',
  styleUrls: ['./schedule-pickup.component.css']
})
export class SchedulePickupComponent {
  availableDates: string[] = this.getAvailableDates();
  availableTimes: string[] = ['08:00 AM', '09:00 AM', '10:00 PM'];
  wasteTypes: string[] = ['Household Waste', 'Recyclable Waste', 'Hazardous Waste'];

  selectedDate: string = '';
  selectedTime: string = '';
  selectedWasteType: string = '';
  confirmationMessage: string = '';

  nextAvailableDate: string = '';

  getAvailableDates(): string[] {
    const dates = [];
    const today = new Date();
    
    let foundNextAvailableDate = false;

    for (let i = 0; i < 30; i++) { 
      const nextDate = new Date();
      nextDate.setDate(today.getDate() + i);

      const dayOfWeek = nextDate.getDay();
      if (dayOfWeek === 3 || dayOfWeek === 5) {
        const formattedDate = nextDate.toISOString().split('T')[0];
        dates.push(formattedDate);

        // Set the first available date
        if (!foundNextAvailableDate) {
          this.nextAvailableDate = formattedDate;
          foundNextAvailableDate = true;
        }
      }
    }
    return dates;
  }

  onSubmit() {
    if (!this.selectedWasteType) {
      alert('Please select at least one type of waste.');
      return;
    }

    this.confirmationMessage = `Pickup scheduled on ${this.selectedDate} at ${this.selectedTime} for ${this.selectedWasteType}.`;
  }
}
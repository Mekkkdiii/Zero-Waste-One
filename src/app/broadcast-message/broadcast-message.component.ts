import { Component } from '@angular/core';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.css']
})
export class BroadcastMessageComponent {
  announcementMessage: string = '';
  confirmationMessage: string = '';

  onSubmit() {
    if (!this.announcementMessage) {
      alert('Please enter an announcement message.');
      return;
    }
    
    // Display a confirmation message
    this.confirmationMessage = `Announcement broadcasted: "${this.announcementMessage}"`;

    // Clear the message input
    this.announcementMessage = '';
  }
}

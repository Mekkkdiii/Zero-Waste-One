import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.css', '../nav/nav.component.css']
})
export class BroadcastMessageComponent {
  announcementMessage: string = '';
  confirmationMessage: string = '';

  constructor(private router: Router) {}

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

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

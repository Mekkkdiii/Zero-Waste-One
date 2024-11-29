import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.css', '../nav/nav.component.css']
})
export class BroadcastMessageComponent {
  announcementMessage: string = '';
  confirmationMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  private backendUrl = 'http://localhost:5001/api/broadcast';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    // Clear previous messages
    this.confirmationMessage = '';
    this.errorMessage = '';

    if (!this.announcementMessage.trim() || this.announcementMessage.trim().length < 5) {
      this.errorMessage = 'Please enter a valid announcement message of at least 5 characters.';
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Authorization token is missing. Please log in again.';
      return;
    }

    // Prepare payload with formatted sent_Time
    const payload = {
      message: this.announcementMessage.trim(),
      notifType: 'announcement',
      sent_Time: new Date().toLocaleTimeString(), // Use toLocaleTimeString for the same format
    };

    this.isLoading = true; // Show loading spinner

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Make the HTTP POST request
    this.http.post(this.backendUrl, payload, { headers }).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.confirmationMessage = `Announcement broadcasted successfully: "${this.announcementMessage}"`;
        this.announcementMessage = '';
        console.log('Broadcast message response:', response);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error broadcasting message:', error.message || error);
        this.errorMessage = error.error?.message || error.statusText || 'Failed to broadcast announcement. Please try again.';
      }
    );
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

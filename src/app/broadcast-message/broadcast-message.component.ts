import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
 
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
 
  private backendUrl = 'http://localhost:5001/api/broadcast';  // Adjust the URL as needed
 
  constructor(private router: Router, private http: HttpClient) {}
 
  onSubmit() {
    // Clear previous messages
    this.confirmationMessage = '';
    this.errorMessage = '';
 
    // Input validation
    if (!this.announcementMessage.trim() || this.announcementMessage.trim().length < 5) {
      this.errorMessage = 'Please enter a valid announcement message of at least 5 characters.';
      return;
    }
 
    // Retrieve userId and communityId from localStorage
    const userId = localStorage.getItem('userId');
    const communityId = localStorage.getItem('communityId');
    if (!userId || !communityId) {
      this.errorMessage = 'UserId or CommunityId is missing. Please log in again.';
      return;
    }
 
    // Prepare payload
    const payload = {
      userId: userId,  // Ensure userId is sent as a string
      communityId: communityId,  // Ensure communityId is sent as a string
      message: this.announcementMessage.trim(),
      notifType: 'announcement',  // The notifType is set as 'announcement'
      sent_Time: new Date().toLocaleTimeString(), // Ensure the time format is consistent with the API
    };
 
    this.isLoading = true; // Show loading spinner
 
    // Make the HTTP POST request
    this.http.post(this.backendUrl, payload).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.confirmationMessage = `Announcement broadcasted successfully: "${this.announcementMessage}"`;
        this.announcementMessage = ''; // Reset the form
        console.log('Broadcast message response:', response);
      },
      (error) => {
        this.isLoading = false;
        console.error('Error broadcasting message:', error.message || error);
        
        // Handle error message from the API response
        this.errorMessage = error.error?.message || error.statusText || 'Failed to broadcast announcement. Please try again.';
      }
    );
  }
 
  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
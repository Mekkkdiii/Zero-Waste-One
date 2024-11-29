import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
 
interface Notification {
  message: string;
  sent_Time: string;
  sent_Date: string;
  read: boolean;
}
 
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css', '../nav/nav.component.css']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  userId: string = '';
  communityId: string = '';
  notificationsEnabled: boolean = true;
 
  constructor(private http: HttpClient, private router: Router) {}
 
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
 
    this.loadNotifications();
  }
 
  loadNotifications(): void {
    const headers = new HttpHeaders().set('community-id', this.communityId);
  
    this.http.get<Notification[]>(`http://localhost:5001/api/notifications/${this.communityId}`, { headers }).subscribe(
      (data) => {
        console.log('Fetched notifications:', data);
        this.notifications = data.map(notification => ({
          ...notification,
          read: notification.read || false // Ensure 'read' property exists
        }));
      },
      (error) => {
        console.error('Failed to load notifications:', error);
        alert('Could not load notifications. Please try again later.');
      }
    );
  }  
 
  toggleNotifications(): void {
    this.notificationsEnabled = !this.notificationsEnabled;
 
    if (!this.notificationsEnabled) {
      this.notifications = [];
      console.log("Notifications disabled.");
    } else {
      console.log("Notifications enabled.");
      this.loadNotifications();
    }
  }
 
  markAsRead(notification: Notification): void {
    notification.read = true;
 
    // Optionally, send the update to the backend
    const payload = { read: true };
    this.http.patch(`http://localhost:5001/api/notifications/${notification.message}`, payload).subscribe(
      () => console.log(`Notification marked as read: ${notification.message}`),
      (error) => console.error('Error marking notification as read:', error)
    );
  }
 
  deleteNotification(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n !== notification);
 
    this.http.delete(`http://localhost:5001/api/notifications/${notification.message}`).subscribe(
      () => console.log(`Notification deleted: ${notification.message}`),
      (error) => console.error('Error deleting notification:', error)
    );
  }
 
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
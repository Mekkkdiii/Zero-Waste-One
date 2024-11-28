import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Notification {
  message: string;
  date: Date;
  read: boolean; 
}

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css', '../nav/nav.component.css']
})
export class NotificationListComponent implements OnInit {
  notificationsEnabled: boolean = true; 
  notifications: Notification[] = []; // Array to store notifications

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadNotifications(); // Load notifications when component initializes
  }

  loadNotifications() {
    this.notifications = [
      { message: 'Upcoming waste pickup scheduled for tomorrow.', date: new Date('2024-10-23'), read: false },
      { message: 'Reminder: Please separate recyclable materials.', date: new Date(), read: false },
      { message: 'Community announcement: New recycling rules have been implemented.', date: new Date('2024-10-20'), read: false },
      { message: 'Waste pickup scheduled for tomorrow.', date: new Date(), read: false },
      { message: 'Community meeting on Saturday.', date: new Date(), read: false },
    ];
  }

  toggleNotifications() {
    if (!this.notificationsEnabled) {
      this.notifications = []; // Clear notifications when disabled
      console.log("Notifications disabled");
    } else {
      console.log("Notifications enabled");
      this.loadNotifications(); 
    }
  }

  markAsRead(notification: Notification) {
    notification.read = true; // Update the read status
  }

  deleteNotification(notification: Notification) {
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}



import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent {
  user: any = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    community: '',
    role: 'community-user'
  };

  communities: string[] = ['Greenwood Apartments', 'Blue Hills', 'Sunrise Park']; // Example communities

  constructor(private router: Router) {}

  // Register user and redirect to the login page
  registerUser() {
    if (this.user.fullName && this.user.email) {
      // Save user data to local storage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      storedUsers.push(this.user);
      localStorage.setItem('users', JSON.stringify(storedUsers));

      // Navigate to the login page after registration
      this.router.navigate(['/login']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

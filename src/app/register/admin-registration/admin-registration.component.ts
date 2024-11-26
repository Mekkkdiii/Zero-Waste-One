import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css'],
})
export class AdminRegistrationComponent {
  admin = {
    name: '',
    email: '',
    phone: '',
    role: 'admin'
  };

  constructor(private router: Router) {}

  // Navigate to the Create Community component and pass the admin data via state
  onNext() {
    this.router.navigate(['/create-community'], {
      state: { adminData: this.admin },
    });
  }

  // Handle submission logic after community creation
  onCommunityCreated() {
    // Store admin data in local storage
    localStorage.setItem('users', JSON.stringify([this.admin]));
    
    // Redirect to the login page after community creation
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

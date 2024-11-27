import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css'],
})
export class AdminRegistrationComponent {
  admin = {
    fullName: '',  // Renamed from 'name' to 'fullName'
    email: '',
    phone: ''
  };

  successMessage: string = '';  // For success message
  errorMessage: string = '';    // For error message

  constructor(private router: Router, private http: HttpClient) {}

  // Register the admin
  registerAdmin() {
    const adminData = {
      fullName: this.admin.fullName,  
      email: this.admin.email,
      phone: this.admin.phone,
    };

    this.http.post('http://localhost:5000/api/admin/register', adminData).subscribe(
      (response: any) => {
        const adminId = response._id;  // Admin ID is returned from the registration API

        if (adminId) {
          // Store adminId in localStorage
          localStorage.setItem('adminId', adminId);
          console.log('Admin ID stored in localStorage:', adminId);

          // Display success message
          this.successMessage = 'Admin registration successful! Redirecting to create community page...';
          this.errorMessage = '';  // Clear any previous error messages

          // Redirect to the create-community page after a brief delay to show the message
          setTimeout(() => {
            this.router.navigate(['/create-community']);
          }, 2000); // Redirect after 2 seconds
        } else {
          console.error('Admin ID missing in the response.');
          this.errorMessage = 'Error: Admin registration failed. Please try again.';
          this.successMessage = '';  // Clear any previous success messages
        }
      },
      (error) => {
        console.error('Error during admin registration:', error);
        this.errorMessage = 'Error: Something went wrong with the registration process. Please try again later.';
        this.successMessage = '';  // Clear any previous success messages
      }
    );
  }

  // Navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  // Replace with your actual backend URL
  private backendUrl = 'http://localhost:5000/api/login';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  login() {
    // Reset error message
    this.errorMessage = '';
    this.isLoading = true; // Show loading spinner

    // Send login credentials to the backend
    this.http.post(this.backendUrl, { email: this.email, password: this.password }).subscribe(
      (response: any) => {
        this.isLoading = false; // Hide loading spinner

        // Check response for user role and token
        if (response && response.token && response.role) {
          // Store the token in local storage
          localStorage.setItem('authToken', response.token);

          // Store the user role in local storage
          localStorage.setItem('userRole', response.role);

          // Navigate based on user role
          if (response.role === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('isCommunityUser', 'false');
            this.router.navigate(['/admin-dashboard']);
          } else if (response.role === 'community-user') {
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('isCommunityUser', 'true');
            this.router.navigate(['/community-dashboard']);
          }
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
      (error) => {
        this.isLoading = false; // Hide loading spinner
        this.errorMessage = 'Invalid email or password. Please try again.';
        console.error('Login error:', error);
      }
    );
  }

  navigateToRegister(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin-register']);
    } else {
      this.router.navigate(['/user-register']);
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
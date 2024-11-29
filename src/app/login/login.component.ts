import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';  // Import AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  // Replace with your actual backend URL
  private backendUrl = 'http://localhost:5001/api/login';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService  // Inject AuthService
  ) {}

  ngOnInit(): void {}

  login() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true; // Show loading spinner
  
    // Send login credentials to the backend
    this.http.post(this.backendUrl, { email: this.email, password: this.password }).subscribe(
      (response: any) => {
        this.isLoading = false; // Hide loading spinner
  
        // Check response for user data and token
        if (response && response.user && response.token) {
          const user = response.user; // Assuming the response contains a `user` object
          const token = response.token; // Assuming the response contains a JWT token
  
          // Use AuthService to store the token, user data, and role
          this.authService.login(token, user, user.role); // Call AuthService login method
  
          // Success message
          this.successMessage = 'Login successful! Redirecting...';
  
          // Navigate based on user role
          if (user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (user.role === 'community-user') {
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

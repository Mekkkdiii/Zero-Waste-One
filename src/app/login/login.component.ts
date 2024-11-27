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

  // Replace with your actual backend URL
  private backendUrl = 'http://localhost:5000/api/login';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {}

  login() {
    // Send login credentials to the backend
    this.http
      .post(this.backendUrl, { email: this.email, password: this.password })
      .subscribe(
        (response: any) => {
          // Check response for user role and redirect accordingly
          if (response && response.role) {
            localStorage.setItem('userRole', response.role); // Store user role for navbar
            this.updateNavbar(response.role); // Update navbar state

            if (response.role === 'admin') {
              this.router.navigate(['/admin-dashboard']);
            } else if (response.role === 'community-user') {
              this.router.navigate(['/community-dashboard']);
            }
          }
        },
        (error) => {
          // Handle login failure
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      );
  }

  updateNavbar(role: string) {
    if (role === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('isCommunityUser', 'false');
    } else if (role === 'community-user') {
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('isCommunityUser', 'true');
    }
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
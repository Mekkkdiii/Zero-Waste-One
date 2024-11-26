import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DUMMY_USERS } from '../data/dummy-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    localStorage.setItem('users', JSON.stringify(DUMMY_USERS));
  }

  login() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find(
      (u: { email: string; password: string; role: string }) =>
        u.email === this.email && u.password === this.password
    );

    if (user) {
      localStorage.setItem('userRole', user.role); // Store the user role
      this.updateNavbar(user.role); // Update navbar state

      // Navigate based on user role
      if (user.role === 'admin') {
        this.router.navigate(['/admin-dashboard']);
      } else if (user.role === 'community-user') {
        this.router.navigate(['/community-dashboard']);
      }
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }

  updateNavbar(role: string) {
    // Update local storage or a variable to manage navbar visibility
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

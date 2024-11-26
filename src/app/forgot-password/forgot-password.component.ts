import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = ''; 

  constructor(private router: Router) {}

  // Check if email exists in local storage and simulate reset link
  sendResetEmail() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = storedUsers.some(
      (user: { email: string }) => user.email === this.email
    );

    if (!this.email) {
      this.message = 'Please enter your email.';
    } else if (userExists) {
      this.message =
        'Password reset link has been sent to your email. Please check your inbox.';
    } else {
      this.message = 'Email not found. Please register or try again.';
    }
  }

  // Navigate back to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}

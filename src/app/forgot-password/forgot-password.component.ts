import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = ''; 

  constructor(private router: Router, private http: HttpClient) {}

  sendResetEmail() {
    if (!this.email) {
      this.message = 'Please enter your email.';
      return;
    }

    // Send the email to the backend for password reset
    this.http.post('http://localhost:5001/api/forgot-password', { email: this.email })
      .subscribe(
        (response: any) => {
          this.message = response.message;
        },
        (error) => {
          console.error('Error during password reset:', error);
          this.message = 'An error occurred. Please try again.';
        }
      );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
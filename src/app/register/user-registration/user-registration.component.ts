import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  constructor(private router: Router, private http: HttpClient) {}

  // Register user and redirect to the login page
  registerUser() {
    const userData = {
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      communityId: this.user.community,
    };
  
    this.http.post('http://localhost:5000/api/user/register', userData).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error(error);
      }
    );
  }  

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
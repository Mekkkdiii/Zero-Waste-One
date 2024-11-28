import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  user: any = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    community: '', // Will hold the selected community's _id
    role: 'community-user'
  };
 
  communities: any[] = []; // To hold community data
  successMessage: string = '';  // For success message
  errorMessage: string = '';    // For error message
 
  constructor(private router: Router, private http: HttpClient) {}
 
  ngOnInit(): void {
    this.loadCommunities(); // Fetch communities when the component is initialized
  }
 
  // Fetch communities from the backend
  loadCommunities(): void {
    this.http.get<any[]>('http://localhost:5001/api/communities').subscribe(
      (response) => {
        this.communities = response; // Populate communities with the fetched data
      },
      (error) => {
        console.error('Error fetching communities:', error);
      }
    );
  }
 
  // Register user and redirect to the login page
  registerUser() {
    const userData = {
      fullName: this.user.fullName,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      communityId: this.user.community, // Ensure this uses the _id from MongoDB
    };
 
    this.http.post('http://localhost:5001/api/user/register', userData).subscribe(
      (response) => {
        this.successMessage = 'Registration successful! Please check your email for login details.';
        this.errorMessage = ''; // Clear any previous error messages
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // Redirect after 2 seconds to allow user to see the success message
      },
      (error) => {
        console.error(error);
        this.errorMessage = 'Error registering user. Please try again later.';
        this.successMessage = ''; // Clear any previous success messages
      }
    );
  }
 
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
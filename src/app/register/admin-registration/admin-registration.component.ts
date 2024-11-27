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

          // Redirect to the create-community page
          this.router.navigate(['/create-community']);
        } else {
          console.error('Admin ID missing in the response.');
        }
      },
      (error) => {
        console.error('Error during admin registration:', error);
      }
    );
  }  

  // Navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
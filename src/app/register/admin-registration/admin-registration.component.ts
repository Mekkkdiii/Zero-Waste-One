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
      fullName: this.admin.fullName,  // Renamed to 'fullName'
      email: this.admin.email,
      phone: this.admin.phone,
    };
  
    this.http.post('http://localhost:5000/api/admin/register', adminData).subscribe(
      (response) => {
        this.router.navigate(['/create-community'], { state: { adminData: response } });
      },
      (error) => {
        console.error(error);
      }
    );
  }  

  // Navigate to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }
}

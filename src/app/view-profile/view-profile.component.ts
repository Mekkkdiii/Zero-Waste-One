import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
})
export class ViewProfileComponent implements OnInit {
  profileForm: FormGroup;
  userRole: string = '';
  currentPassword: string = '';

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      community: [''], // Read-only field
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit(): void {
    this.initializeStaticData(); // Initialize data in localStorage
    this.loadUserData(); // Load correct data into the form
  }

  // Initialize static admin and user data in localStorage
  initializeStaticData(): void {
    const adminData = {
      fullName: 'Admin 1',
      email: 'admin1@admin.com',
      phone: '0123456789',
      community: 'Greenwood Apartments',
      role: 'admin',
    };

    const userData = {
      fullName: 'User 1',
      email: 'user1@community.com',
      phone: '0987654321',
      community: 'Greenwood Apartments',
      role: 'user',
    };

    // Store static data if not already present
    if (!localStorage.getItem('adminData')) {
      localStorage.setItem('adminData', JSON.stringify(adminData));
    }
    if (!localStorage.getItem('userData')) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  // Load the correct user data from sessionStorage
  loadUserData(): void {
    const userRole = sessionStorage.getItem('userRole'); // Determine logged-in role

    // Retrieve data based on role
    const userData =
      userRole === 'admin'
        ? JSON.parse(localStorage.getItem('adminData') || '{}')
        : JSON.parse(localStorage.getItem('userData') || '{}');

    this.userRole = userData.role;
    this.currentPassword = this.userRole === 'admin' ? 'Default123' : 'Password123';

    // Populate the form with retrieved data
    this.profileForm.patchValue({
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      community: userData.community || '',
    });
  }

  // Form submission logic to update profile and password
  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser = this.profileForm.value;

      // Password validation logic
      if (updatedUser.newPassword && updatedUser.newPassword === updatedUser.confirmPassword) {
        alert('Password updated successfully!');
        this.currentPassword = updatedUser.newPassword; // Update password
      } else if (updatedUser.newPassword || updatedUser.confirmPassword) {
        alert('Passwords do not match or are empty.');
        return;
      }

      // Save the updated data in sessionStorage
      const updatedUserData = {
        ...JSON.parse(sessionStorage.getItem('registeredUser') || '{}'),
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      };

      sessionStorage.setItem('registeredUser', JSON.stringify(updatedUserData));
      alert('Profile updated successfully!');
    } else {
      alert('Please fill out all fields correctly.');
    }
  }
}

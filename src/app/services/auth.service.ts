import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  login(token: string, userData: any, role: string): void {
    localStorage.setItem('token', token); // Store JWT token
    localStorage.setItem('user', JSON.stringify(userData)); // Store userData
    localStorage.setItem('role', role); // Store role
    
    // Store userId in local storage
    const userId = userData._id;
    localStorage.setItem('userId', userId); // Store userId
  }
  

  // Get userId from localStorage
  getUserId(): string {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user ? user._id : '';
  }

  setUserId(userId: string): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user) {
      user._id = userId;  // Set the userId (_id) field
      localStorage.setItem('user', JSON.stringify(user)); // Update user data in localStorage
    }
  }  

  // Get role from localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Store JWT token in local storage
  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Get JWT token from local storage
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  setRole(role: string): void {
    localStorage.setItem('role', role);
  }

  // Decode the JWT token (you can use 'jwt-decode' for this)
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  // Check if the user is logged in (by checking if the token exists)
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Log out the user by clearing the token from local storage
  logout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }
}
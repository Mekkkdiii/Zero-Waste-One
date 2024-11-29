import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.css', '../nav/nav.component.css']
})
export class ReportIssueComponent implements OnInit {
  newIssue: any = {
    type: '',
    location: '',
    description: '',
    comments: ''
  };
  reportedIssues: any[] = [];
  newIssueFormVisible: boolean = false;
  apiUrl = 'http://localhost:5001/api/issues'; // API endpoint for issues
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // If token is missing, redirect to login page
      this.router.navigate(['/login']);
      return;
    }
    this.loadReportedIssues();
  }

  loadReportedIssues(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Fetch previously reported issues for the current user
    this.http.get<any[]>(this.apiUrl, { headers }).subscribe(
      (response) => {
        this.reportedIssues = response; // Populate reported issues
      },
      (error) => {
        console.error('Failed to load reported issues:', error);
        this.errorMessage = 'Failed to load reported issues. Please try again.';
      }
    );
  }

  submitIssue(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = 'Authorization token is missing. Please log in again.';
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.errorMessage = 'User ID is missing. Please log in again.';
      return;
    }
  
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
  
    const payload = {
      ...this.newIssue,
      userId,  // Send userId in the body
      reportedAt: new Date().toISOString()
    };
  
    // Send the issue to the backend
    this.http.post('http://localhost:5001/api/issues', payload, { headers }).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successMessage = 'Issue reported successfully.';
        this.reportedIssues.push(response);
        this.newIssueFormVisible = false;
        this.newIssue = { type: '', location: '', description: '', comments: '' };
      },
      (error) => {
        this.isLoading = false;
        console.error('Error submitting issue:', error);
        this.errorMessage = error.error?.message || 'Failed to report issue. Please try again.';
      }
    );
  }   

  showNewIssueForm(): void {
    this.newIssueFormVisible = !this.newIssueFormVisible;
    this.errorMessage = '';
    this.successMessage = '';
  }

  logout(): void {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
  
}

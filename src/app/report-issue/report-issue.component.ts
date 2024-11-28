import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for making API requests

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
  apiUrl = 'http://localhost:5001/api'; // Directly set API URL here

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadReportedIssues(); // Fetch issues from the API when the component loads
  }

  loadReportedIssues(): void {
    // Fetch issues from the backend API
    this.http.get<any[]>(`${this.apiUrl}/issues`).subscribe(
      (response) => {
        this.reportedIssues = response; // Store the fetched issues in reportedIssues array
      },
      (error) => {
        console.error('Failed to load reported issues:', error);
      }
    );
  }

  submitIssue(): void {
    if (this.newIssue.type && this.newIssue.location && this.newIssue.description) {
      // Send the new issue to the backend API
      this.http.post(`${this.apiUrl}/issues`, this.newIssue).subscribe(
        (response) => {
          // Add the newly created issue to the list of reported issues
          this.reportedIssues.push(response);
          this.newIssueFormVisible = false; // Hide the form after submission
          this.newIssue = { type: '', location: '', description: '', comments: ''}; // Reset the form
        },
        (error) => {
          console.error('Error submitting issue:', error);
        }
      );
    }
  }

  showNewIssueForm(): void {
    this.newIssueFormVisible = !this.newIssueFormVisible;
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
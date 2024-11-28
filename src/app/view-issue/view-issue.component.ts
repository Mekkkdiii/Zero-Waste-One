import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Issue {
  type: string;
  location: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.css', '../nav/nav.component.css']
})
export class ViewIssueComponent {

  constructor(private router: Router) {}

  issues: Issue[] = [
    { type: 'Missed Pickup', location: 'Street 789', description: 'Bin not collected.', status: 'NEW' },
    { type: 'Overflowing Bin', location: 'Avenue 5', description: 'Bin overflowing for 2 days.', status: 'IN PROGRESS' }
  ];

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

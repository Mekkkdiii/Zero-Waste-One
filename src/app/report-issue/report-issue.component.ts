import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    comments: '',
    photo: null
  };
  reportedIssues: any[] = [];
  newIssueFormVisible: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadReportedIssues();
    this.initializeStaticIssues(); // Initialize static issues
  }

  loadReportedIssues(): void {
    const issuesData = JSON.parse(localStorage.getItem('reportedIssues') || '[]');
    this.reportedIssues = issuesData;
  }

  initializeStaticIssues(): void {
    const staticIssues = [
      {
        type: 'Missed Pickup',
        location: '123 Elm St',
        description: 'The waste was not collected on the scheduled day.',
        comments: 'Please collect it as soon as possible.',
        status: 'NEW'
      },
      {
        type: 'Overflowing Bin',
        location: '456 Oak St',
        description: 'The bin is overflowing and needs urgent attention.',
        comments: 'It is causing a mess in the area.',
        status: 'NEW'
      },
      {
        type: 'Illegal Dumping',
        location: '789 Pine St',
        description: 'There are large bags of trash dumped illegally.',
        comments: 'Needs to be cleaned up immediately.',
        status: 'NEW'
      }
    ];

    // Check if local storage is empty and set static issues if true
    if (!localStorage.getItem('reportedIssues')) {
      localStorage.setItem('reportedIssues', JSON.stringify(staticIssues));
    }
  }

  // Method to submit a new issue
  submitIssue(): void {
    if (this.newIssue.type && this.newIssue.location && this.newIssue.description) {
      this.reportedIssues.push({ ...this.newIssue, status: 'NEW' });
      localStorage.setItem('reportedIssues', JSON.stringify(this.reportedIssues));
      this.newIssueFormVisible = false; // Hide the form after submission
      this.newIssue = { type: '', location: '', description: '', comments: '', photo: null }; // Reset the form
    }
  }

  // Method to toggle the visibility of the new issue form
  showNewIssueForm(): void {
    this.newIssueFormVisible = !this.newIssueFormVisible;
  }

  // Method to handle photo upload (optional)
  onPhotoUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.newIssue.photo = target.files[0];
    }
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

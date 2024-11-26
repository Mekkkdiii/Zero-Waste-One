import { Component } from '@angular/core';

interface Issue {
  type: string;
  location: string;
  description: string;
  status: string;
}

@Component({
  selector: 'app-view-issue',
  templateUrl: './view-issue.component.html',
  styleUrls: ['./view-issue.component.css']
})
export class ViewIssueComponent {
  issues: Issue[] = [
    { type: 'Missed Pickup', location: 'Street 789', description: 'Bin not collected.', status: 'NEW' },
    { type: 'Overflowing Bin', location: 'Avenue 5', description: 'Bin overflowing for 2 days.', status: 'IN PROGRESS' }
  ];
}

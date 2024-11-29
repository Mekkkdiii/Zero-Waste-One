import { Component, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';


Chart.register(...registerables);

@Component({
  selector: 'app-generate-report-admin',
  templateUrl: './generate-report-admin.component.html',
  styleUrls: ['./generate-report.component.css', '../nav/nav.component.css']
})
export class GenerateReportAdminComponent {
  selectedReport: string = '';
  startDate: string = '';
  endDate: string = '';
  reportMessage: string = '';
  chart: any;
  userId: string = '';
  userRole: string | null = null;

  reportOptions: string[] = [
    'Pickup Statistics',
    'Issues Reported',
    'Recycling Rates'
  ];

  @ViewChild('reportChart') reportChart!: ElementRef;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole();
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userId = userId;
    }

    // Ensure the user role is admin
    if (this.userRole !== 'admin') {
      this.router.navigate(['/access-denied']);
    }
  }

  onReportChange(event: Event): void {
    const inputElement = event.target as HTMLSelectElement;
    this.selectedReport = inputElement.value;
    console.log('Selected Report:', this.selectedReport);
  }

  generateReport(): void {
    if (!this.startDate || !this.endDate) {
      alert('Please specify both start and end dates.');
      return;
    }
  
    if (!this.selectedReport) {
      alert('Please select a report type.');
      return;
    }
  
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
  
    this.reportMessage = `Generating ${this.selectedReport} report from ${this.startDate} to ${this.endDate}.`;
  
    this.getReportData(this.selectedReport, start, end).subscribe(data => {
      console.log('Received Data:', data); // Debug: Log the received data
  
      // Check if the data object is structured correctly
      if (!data || !data.labels || !data.values || data.values.length === 0) {
        alert('Insufficient data for the selected date range.');
        return;
      }
  
      if (this.chart) {
        this.chart.destroy();
      }
  
      const chartLabel = this.getChartLabel(this.selectedReport);
  
      this.createChart(data.labels, data.values, chartLabel);
    }, error => {
      console.error('Error fetching report data:', error);  // Log errors
    });
  }
  

  private getReportData(reportType: string, startDate: Date, endDate: Date): Observable<{ labels: string[], values: number[] }> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userId: this.userId,
      userRole: this.userRole
    };

    if (reportType === 'Pickup Statistics') {
      return this.fetchPickupStatistics(params);
    } else if (reportType === 'Issues Reported') {
      return this.fetchIssuesReported(params);
    } else if (reportType === 'Recycling Rates') {
      return this.fetchRecyclingRates(params);
    }
    return new Observable(observer => observer.next({ labels: [], values: [] }));
  }

  private fetchPickupStatistics(params: any): Observable<{ labels: string[], values: number[] }> {
    return this.http.get<{ labels: string[], values: number[] }>(
      'http://localhost:5001/api/pickups/statistics', { params }
    );
  }

  private fetchIssuesReported(params: any): Observable<{ labels: string[], values: number[] }> {
    return this.http.get<{ issueCounts: { [key: string]: number }, message: string }>(
      'http://localhost:5001/api/issues/issue-types', { params }
    ).pipe(
      map(response => {
        // Map issueCounts to labels and values
        const labels = Object.keys(response.issueCounts);  // e.g., ["Missed Pickup", "Illegal Dumping", ...]
        const values = Object.values(response.issueCounts); // e.g., [12, 3, 5, 2]
        return { labels, values };
      })
    );
  }
  

  private fetchRecyclingRates(params: any): Observable<{ labels: string[], values: number[] }> {
    return this.http.get<{ labels: string[], values: number[] }>(
      'http://localhost:5001/api/pickups/recycling-rates', { params }
    );
  }

  private getChartLabel(reportType: string): string {
    if (reportType === 'Pickup Statistics') {
      return 'Waste Type';
    } else if (reportType === 'Issues Reported') {
      return 'Report Type';
    } else if (reportType === 'Recycling Rates') {
      return 'Recyclable Type';
    }
    return '';
  }

  private createChart(labels: string[], values: number[], chartLabel: string): void {
    const integerValues = values.map(value => Math.floor(value));

    const ctx = this.reportChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: integerValues,
          backgroundColor: ['#4CAF50', '#8BC34A', '#388E3C'],
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}
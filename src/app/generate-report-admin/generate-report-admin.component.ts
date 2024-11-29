import { Component, ViewChild, ElementRef } from '@angular/core'; 
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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
  ) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');
    this.userId = localStorage.getItem('userId');

    // Ensure the user role is admin
    if (this.userRole !== 'admin') {
      this.router.navigate(['/login']);
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

    if (!this.userId) {
      alert('User ID is required to generate the report.');
      return;
    }
  
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
  
    this.reportMessage = `Generating ${this.selectedReport} report from ${this.startDate} to ${this.endDate}.`;
  
    this.getReportData(this.selectedReport, start, end).subscribe(
      data => {
        console.log('Received Data:', data);  // Add this to check the received data format

        if (!data || !data.labels || !data.values || data.values.length === 0) {
          alert('Insufficient data for the selected date range.');
          return;
        }

        if (this.chart) {
          this.chart.destroy();
        }

        const chartType = this.getChartType(this.selectedReport);
        const chartLabel = this.getChartLabel(this.selectedReport);
        this.createChart(data.labels, data.values, chartType, chartLabel);
      },
      error => {
        console.error('Error fetching report data:', error);
        alert(error.message || 'An error occurred while fetching report data.');
      }
    );
  }

  private getReportData(reportType: string, startDate: Date, endDate: Date): Observable<{ labels: string[], values: number[] }> {
    const params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      userRole: this.userRole,
    };

    if (this.userRole === 'community-user') {
      params.userId = this.userId;  // Passing userId in params
    }

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
    return this.http.get<{ pickupStats: { [key: string]: number }, message: string }>(
      'http://localhost:5001/api/pickups/statistics', { params }
    ).pipe(
      map(response => {
        const labels = [
          'Recyclable', 'Hazardous', 'Household'
        ];
        const values = [
          response.pickupStats['recyclable'], // Access using bracket notation
          response.pickupStats['hazardous'],
          response.pickupStats['household']
        ];
        return { labels, values };
      }),
      catchError(error => {
        console.error('Error fetching pickup statistics:', error);
        return of({ labels: [], values: [] }); // Return empty data in case of error
      })
    );
  }  
  
  private fetchIssuesReported(params: any): Observable<{ labels: string[], values: number[] }> {
    return this.http.get<{ issueCounts: { [key: string]: number }, message: string }>(
      'http://localhost:5001/api/issues/issue-types', { params }
    ).pipe(
      map(response => {
        const labels = Object.keys(response.issueCounts);
        const values = Object.values(response.issueCounts);
        return { labels, values };
      })
    );
  }

  private fetchRecyclingRates(params: any): Observable<{ labels: string[], values: number[] }> {
    return this.http.get<{ recyclingRates: { [key: string]: number }, message: string }>(
      'http://localhost:5001/api/pickups/recycling-rates', { params }
    ).pipe(
      map(response => {
        const labels = ['Recyclable', 'Hazardous', 'Household'];
        const values = [
          response.recyclingRates['recyclable'], // Access using bracket notation
          response.recyclingRates['hazardous'],
          response.recyclingRates['household']
        ];
        return { labels, values };
      }),
      catchError(error => {
        console.error('Error fetching recycling rates:', error);
        return of({ labels: [], values: [] }); // Return empty data in case of error
      })
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

  private getChartType(reportType: string): keyof ChartTypeRegistry {
    // Return the appropriate chart type based on the report type
    if (reportType === 'Pickup Statistics') {
      return 'bar';  // Bar chart for Pickup Statistics
    } else if (reportType === 'Issues Reported') {
      return 'pie';  // Pie chart for Issues Reported
    } else if (reportType === 'Recycling Rates') {
      return 'doughnut';  // Doughnut chart for Recycling Rates
    }
    return 'bar';  // Default to bar chart
  }

  createChart(labels: string[], values: number[], chartType: keyof ChartTypeRegistry, chartLabel: string): void {
    const integerValues = values.map(value => Math.floor(value));
  
    if (integerValues.every(value => value === 0)) {
      alert('No data available for the selected range.');
      return;
    }
  
    const ctx = this.reportChart.nativeElement.getContext('2d');
  
    this.chart = new Chart(ctx, {
      type: chartType,  // Dynamic chart type
      data: {
        labels: labels,
        datasets: [{
          label: chartLabel,
          data: integerValues,
          backgroundColor: ['#4CAF50', '#8BC34A', '#388E3C'],
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  } 
}
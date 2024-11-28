import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';
 
Chart.register(...registerables);
 
@Component({
  selector: 'app-generate-report-admin',
  templateUrl: './generate-report-admin.component.html',
  styleUrls: ['./generate-report.component.css', '../nav/nav.component.css'],
})
export class GenerateReportAdminComponent {
  reportType = '';
  startDate: string = '';
  endDate: string = '';
  chart: any;
  isReportGenerated = false; // Flag to control table and chart visibility
 
  wasteData = [
    { type: 'Recyclable Waste', amount: 40, date: '2024-10-01' },
    { type: 'Household Waste', amount: 35, date: '2024-10-05' },
    { type: 'Hazardous Waste', amount: 25, date: '2024-10-10' },
  ];
 
  issuesData = [
    { issue: 'Missed Pickup', count: 5, date: '2024-10-02' },
    { issue: 'Overflowing Bin', count: 8, date: '2024-10-08' },
    { issue: 'Illegal Dumping', count: 2, date: '2024-10-12' },
  ];
 
  recyclingRates = [
    { week: 'Week 1', rate: 20, date: '2024-10-01' },
    { week: 'Week 2', rate: 30, date: '2024-10-07' },
    { week: 'Week 3', rate: 25, date: '2024-10-14' },
    { week: 'Week 4', rate: 35, date: '2024-10-21' },
    { week: 'Week 5', rate: 40, date: '2024-10-24' },
  ];

  constructor(private router: Router) {}
 
  generateReport() {
    if (!this.reportType || !this.startDate || !this.endDate) {
      alert('Please select a report type and date range.');
      return;
    }
 
    if (this.chart) this.chart.destroy(); // Destroy previous chart
 
    const data = this.filterAndSortData();
    const chartType = this.getChartType();
 
    this.chart = new Chart('reportChart', {
      type: chartType,
      data: {
        labels: data.map((item) => item.type || item.issue || item.week),
        datasets: [
          {
            label: this.getChartLabel(),
            data: data.map((item) => item.amount || item.count || item.rate),
            backgroundColor: this.getBackgroundColors(),
            borderColor: '#2196F3',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true },
        },
      },
    });
 
    this.isReportGenerated = true; // Set flag to true only when report is generated
  }
 
  filterAndSortData() {
    let data = [];
    switch (this.reportType) {
      case 'pickup':
        data = this.wasteData;
        break;
      case 'issues':
        data = this.issuesData;
        break;
      case 'recycling':
        data = this.recyclingRates;
        break;
    }
 
    return data
      .filter(
        (item) =>
          new Date(item.date) >= new Date(this.startDate) &&
          new Date(item.date) <= new Date(this.endDate)
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
 
  getChartType() {
    switch (this.reportType) {
      case 'pickup':
        return 'pie';
      case 'issues':
        return 'bar';
      case 'recycling':
        return 'line';
      default:
        return 'bar';
    }
  }
 
  getChartLabel() {
    switch (this.reportType) {
      case 'pickup':
        return 'Waste Collected (by Type)';
      case 'issues':
        return 'Reported Issues';
      case 'recycling':
        return 'Recycling Rates (%)';
      default:
        return '';
    }
  }
 
  getBackgroundColors() {
    return ['#4CAF50', '#FF9800', '#F44336'];
  }

  logout() {
    localStorage.clear(); // Clear session data
    this.router.navigate(['/login']); // Redirect to login page
  }
}

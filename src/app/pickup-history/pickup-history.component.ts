import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PickupRecord {
  date: Date;
  type: string;
}

@Component({
  selector: 'app-pickup-history',
  templateUrl: './pickup-history.component.html',
  styleUrls: ['./pickup-history.component.css', '../nav/nav.component.css']
})
export class PickupHistoryComponent implements OnInit {
  wasteTypes: string[] = ['Household Waste', 'Recyclable Waste', 'Hazardous Waste'];
  history: PickupRecord[] = [];
  filteredHistory: PickupRecord[] = [];
  startDate: string = '';
  endDate: string = '';
  selectedWasteType: string = '';
  filtersApplied: boolean = false;
  private chart: Chart | null = null; 

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.loadPickupHistory();
  }

  loadPickupHistory() {
    const userId = localStorage.getItem('userId');  // Retrieve userId from local storage
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    // Call the backend to get pickup history based on userId
    this.http.get<{ date: string, type: string }[]>(`http://localhost:5001/api/pickups/${userId}`)
      .subscribe(
        (response) => {
          this.history = response.map(record => ({
            date: new Date(record.date),
            type: record.type
          }));
          this.filteredHistory = [...this.history];
          this.updateChart();
        },
        (error) => {
          console.error('Error retrieving pickup history:', error);
        }
      );
  }

  applyFilters() {
    this.filtersApplied = true;

    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      alert('Start date must be before the end date.');
      return;
    }

    this.filteredHistory = this.history.filter(record => {
      const recordDate = new Date(record.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      return (!start || recordDate >= start) &&
             (!end || recordDate <= end) &&
             (!this.selectedWasteType || record.type === this.selectedWasteType);
    });

    if (!this.isFilterApplied()) {
      this.filteredHistory = [...this.history]; 
    }

    this.updateChart();
  }

  isFilterApplied(): boolean {
    return this.startDate !== '' || this.endDate !== '' || this.selectedWasteType !== '';
  }

  sortBy(property: keyof PickupRecord) {
    const historyToSort = this.isFilterApplied() ? this.filteredHistory : this.history;

    historyToSort.sort((a, b) => {
      if (a[property] > b[property]) return 1;
      if (a[property] < b[property]) return -1;
      return 0;
    });

    this.updateChart();
  }

  updateChart() {
    const ctx = (document.getElementById('wasteTypeChart') as HTMLCanvasElement)?.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return; 
    }

    const wasteCount = this.filteredHistory.reduce((acc, record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = {
      labels: Object.keys(wasteCount),
      datasets: [{
        label: 'Waste Type Count',
        data: Object.values(wasteCount),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: 'rgba(0, 0, 0, 1)',
        borderWidth: 1,
      }],
    };

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (this.chart) {
      this.chart.data = chartData;
      this.chart.update();
    } else {
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

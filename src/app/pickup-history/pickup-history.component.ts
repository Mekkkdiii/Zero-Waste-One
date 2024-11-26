import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

interface PickupRecord {
  date: Date;
  type: string;
}

@Component({
  selector: 'app-pickup-history',
  templateUrl: './pickup-history.component.html',
  styleUrls: ['./pickup-history.component.css']
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

  ngOnInit() {
    this.loadPickupHistory();
  }

  loadPickupHistory() {
    this.history = [
      { date: new Date('2024-10-02'), type: 'Household Waste' },
      { date: new Date('2024-10-04'), type: 'Recyclable Waste' },
      { date: new Date('2024-10-09'), type: 'Household Waste' },
      { date: new Date('2024-10-11'), type: 'Hazardous Waste' },
      { date: new Date('2024-10-16'), type: 'Household Waste' },
      { date: new Date('2024-10-18'), type: 'Recyclable Waste' },
    ];
    this.filteredHistory = [...this.history];
    this.updateChart(); 
  }

  applyFilters() {
    this.filtersApplied = true;

    // Validate date range
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      alert('Start date must be before the end date.');
      return; }

    // Apply filters to the pickup history
    this.filteredHistory = this.history.filter(record => {
      const recordDate = new Date(record.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      return (!start || recordDate >= start) &&
             (!end || recordDate <= end) &&
             (!this.selectedWasteType || record.type === this.selectedWasteType);
    });

    // Check if no filters are actually applied
    if (!this.isFilterApplied()) {
      this.filteredHistory = [...this.history]; // Reset if no filters applied
    }

    this.updateChart(); // Update chart after applying filters
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

    // Count waste types based on filtered history
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

    // Clear existing chart before rendering a new one
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 

    // Create a new chart or update the existing one
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
}
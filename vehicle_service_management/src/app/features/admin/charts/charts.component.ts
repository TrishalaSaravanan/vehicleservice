import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  private Chart: any;
  private serviceChart: any;
  private revenueChart: any;
  private appointmentChart: any;
  private serviceDistributionData: any = null;
  private revenueByServiceData: any = null;
  private weeklyAppointmentsData: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadServiceDistribution();
    this.loadRevenueByService();
    this.loadWeeklyAppointments();
  }

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import Chart.js only in browser
      const chartModule = await import('chart.js/auto');
      this.Chart = chartModule.default;
      this.initializeCharts();
    }
  }

  ngOnDestroy(): void {
    if (this.serviceChart) {
      this.serviceChart.destroy();
    }
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.appointmentChart) {
      this.appointmentChart.destroy();
    }
  }

  private loadServiceDistribution(): void {
    this.adminService.getServiceDistribution().subscribe({
      next: (response) => {
        if (response.success) {
          this.serviceDistributionData = response.distribution;
          // If Chart.js is already loaded, update the chart
          if (this.Chart && this.serviceChart) {
            this.updateServiceDistributionChart();
          }
        }
      },
      error: (error) => {
        console.error('Error loading service distribution:', error);
        // Use fallback static data on error
        this.serviceDistributionData = {
          labels: ['Full Service', 'Oil Change', 'AC Repair', 'Brake Service'],
          data: [35, 25, 20, 20],
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
        };
      }
    });
  }

  private loadRevenueByService(): void {
    this.adminService.getRevenueByService().subscribe({
      next: (response) => {
        if (response.success) {
          this.revenueByServiceData = response.revenue;
          // If Chart.js is already loaded, update the chart
          if (this.Chart && this.revenueChart) {
            this.updateRevenueChart();
          }
        }
      },
      error: (error) => {
        console.error('Error loading revenue by service:', error);
        // Use fallback static data on error
        this.revenueByServiceData = {
          labels: ['Full Service', 'Oil Change', 'AC Repair', 'Brake Service', 'Tire Service'],
          data: [12000, 8500, 9000, 7500, 6000],
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        };
      }
    });
  }

  private loadWeeklyAppointments(): void {
    this.adminService.getWeeklyAppointments().subscribe({
      next: (response) => {
        if (response.success) {
          this.weeklyAppointmentsData = response.appointments;
          // If Chart.js is already loaded, update the chart
          if (this.Chart && this.appointmentChart) {
            this.updateAppointmentChart();
          }
        }
      },
      error: (error) => {
        console.error('Error loading weekly appointments:', error);
        // Use fallback static data on error
        this.weeklyAppointmentsData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: [12, 19, 15, 25, 22, 18, 8],
          total: 119
        };
      }
    });
  }

  private initializeCharts(): void {
    this.createServiceDistributionChart();
    this.createRevenueChart();
    this.createAppointmentTrendChart();
  }

  private createServiceDistributionChart(): void {
    const ctx = document.getElementById('serviceChart') as HTMLCanvasElement;
    if (ctx && this.Chart) {
      // Use dynamic data if available, otherwise use fallback
      const chartData = this.getServiceDistributionChartData();
      
      this.serviceChart = new this.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: chartData.labels,
          datasets: [{
            data: chartData.data,
            backgroundColor: chartData.colors,
            borderColor: chartData.colors.map((color: string) => this.darkenColor(color, 0.2)),
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                  size: 12,
                  family: 'Inter, sans-serif'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              cornerRadius: 8,
              callbacks: {
                label: function(context: any) {
                  return `${context.label}: ${context.parsed}%`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            duration: 1000
          }
        }
      });
    }
  }

  private getServiceDistributionChartData(): any {
    if (this.serviceDistributionData) {
      return {
        labels: this.serviceDistributionData.labels,
        data: this.serviceDistributionData.data,
        colors: this.serviceDistributionData.colors
      };
    }
    
    // Fallback static data
    return {
      labels: ['Full Service', 'Oil Change', 'AC Repair', 'Brake Service'],
      data: [35, 25, 20, 20],
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
    };
  }

  private updateServiceDistributionChart(): void {
    if (this.serviceChart && this.serviceDistributionData) {
      const chartData = this.getServiceDistributionChartData();
      this.serviceChart.data.labels = chartData.labels;
      this.serviceChart.data.datasets[0].data = chartData.data;
      this.serviceChart.data.datasets[0].backgroundColor = chartData.colors;
      this.serviceChart.data.datasets[0].borderColor = chartData.colors.map((color: string) => this.darkenColor(color, 0.2));
      this.serviceChart.update();
    }
  }

  private darkenColor(color: string, factor: number): string {
    // Simple color darkening function for hex colors
    if (color.startsWith('#')) {
      const num = parseInt(color.slice(1), 16);
      const r = Math.floor((num >> 16) * (1 - factor));
      const g = Math.floor(((num >> 8) & 0x00FF) * (1 - factor));
      const b = Math.floor((num & 0x0000FF) * (1 - factor));
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }
    return color;
  }

  private getRevenueChartData(): any {
    if (this.revenueByServiceData) {
      return {
        labels: this.revenueByServiceData.labels,
        data: this.revenueByServiceData.data,
        colors: this.revenueByServiceData.colors
      };
    }
    
    // Fallback static data
    return {
      labels: ['Full Service', 'Oil Change', 'AC Repair', 'Brake Service', 'Tire Service'],
      data: [12000, 8500, 9000, 7500, 6000],
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
    };
  }

  private updateRevenueChart(): void {
    if (this.revenueChart && this.revenueByServiceData) {
      const chartData = this.getRevenueChartData();
      this.revenueChart.data.labels = chartData.labels;
      this.revenueChart.data.datasets[0].data = chartData.data;
      this.revenueChart.data.datasets[0].backgroundColor = chartData.colors.map((color: string) => color + 'CC');
      this.revenueChart.data.datasets[0].borderColor = chartData.colors;
      this.revenueChart.update();
    }
  }

  private createRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (ctx && this.Chart) {
      const chartData = this.getRevenueChartData();
      this.revenueChart = new this.Chart(ctx, {
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Revenue',
            data: chartData.data,
            backgroundColor: chartData.colors.map((color: string) => color + 'CC'), // Add transparency
            borderColor: chartData.colors,
            borderWidth: 2,
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              cornerRadius: 8,
              callbacks: {
                label: function(context: any) {
                  return `Revenue: ${context.parsed.y.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                },
                callback: function(value: any) {
                  return value.toLocaleString();
                }
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
  }

  private createAppointmentTrendChart(): void {
    const ctx = document.getElementById('appointmentChart') as HTMLCanvasElement;
    if (ctx && this.Chart) {
      const chartData = this.getAppointmentChartData();
      this.appointmentChart = new this.Chart(ctx, {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [{
            label: 'Appointments',
            data: chartData.data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              cornerRadius: 8,
              callbacks: {
                label: function(context: any) {
                  return `Appointments: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                font: {
                  family: 'Inter, sans-serif',
                  size: 11
                }
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }
  }

  private getAppointmentChartData(): any {
    if (this.weeklyAppointmentsData) {
      return {
        labels: this.weeklyAppointmentsData.labels,
        data: this.weeklyAppointmentsData.data
      };
    }
    
    // Fallback static data
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [12, 19, 15, 25, 22, 18, 8]
    };
  }

  private updateAppointmentChart(): void {
    if (this.appointmentChart && this.weeklyAppointmentsData) {
      const chartData = this.getAppointmentChartData();
      this.appointmentChart.data.labels = chartData.labels;
      this.appointmentChart.data.datasets[0].data = chartData.data;
      this.appointmentChart.update();
    }
  }
}

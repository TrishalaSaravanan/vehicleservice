import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats } from '../../../services/admin.service';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div *ngFor="let stat of stats" 
           class="stat-card bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
           [ngClass]="{
             'border-l-4 border-l-primary': stat.color === 'primary',
             'border-l-4 border-l-secondary': stat.color === 'secondary',
             'border-l-4 border-l-accent': stat.color === 'accent',
             'border-l-4 border-l-green-500': stat.color === 'green'
           }">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">{{stat.title}}</p>
            <p class="text-2xl sm:text-3xl font-bold mt-2 tracking-tight"
               [ngClass]="{
                 'text-primary': stat.color === 'primary',
                 'text-secondary': stat.color === 'secondary',
                 'text-accent': stat.color === 'accent',
                 'text-green-500': stat.color === 'green'
               }">
               <span *ngIf="!loading">{{stat.value}}</span>
               <span *ngIf="loading" class="animate-pulse bg-gray-200 rounded w-16 h-8 inline-block"></span>
            </p>
          </div>
          <div class="p-3 sm:p-4 rounded-xl flex-shrink-0"
               [ngClass]="{
                 'bg-blue-50': stat.color === 'primary',
                 'bg-sky-50': stat.color === 'secondary',
                 'bg-amber-50': stat.color === 'accent',
                 'bg-green-50': stat.color === 'green'
               }">
            <i [class]="stat.icon + ' text-lg sm:text-xl'"
               [ngClass]="{
                 'text-primary': stat.color === 'primary',
                 'text-secondary': stat.color === 'secondary',
                 'text-accent': stat.color === 'accent',
                 'text-green-500': stat.color === 'green'
               }"></i>
          </div>
        </div>
        <div class="mt-3 sm:mt-4 flex items-center">
          <span class="text-sm font-medium flex items-center"
           [ngClass]="{
             'text-green-600': stat.trend === 'up',
             'text-red-600': stat.trend === 'down'
           }">
            <i [class]="stat.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" class="mr-1 text-xs"></i> 
            <span *ngIf="!loading">{{stat.change}}</span>
            <span *ngIf="loading" class="animate-pulse bg-gray-200 rounded w-8 h-4 inline-block"></span>
          </span>
          <span class="text-sm text-gray-500 ml-2">from {{stat.period}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    
    .stat-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    :host {
      --primary: #1B4B88;
      --secondary: #2D9CDB;
      --accent: #F2C94C;
    }

    /* Mobile First Responsive Design */
    @media (max-width: 640px) {
      .stat-card {
        padding: 1rem;
      }
    }

    @media (min-width: 641px) {
      .stat-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class StatsCardsComponent implements OnInit {
  stats = [
    {
      title: 'Total Mechanics',
      value: '0',
      icon: 'fas fa-tools',
      color: 'secondary',
      trend: 'up',
      change: '0%',
      period: 'last month'
    },
    {
      title: 'New Bookings',
      value: '0',
      icon: 'fas fa-calendar-check',
      color: 'accent',
      trend: 'up',
      change: '0%',
      period: 'yesterday'
    },
    {
      title: 'Today Schedules',
      value: '0',
      icon: 'fas fa-clock',
      color: 'green',
      trend: 'up',
      change: '0%',
      period: 'yesterday'
    }
  ];

  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    console.log('Loading admin stats...'); // Debug log
    this.adminService.getAdminStats().subscribe({
      next: (response) => {
        console.log('Admin stats response:', response); // Debug log
        if (response.success) {
          this.updateStatsFromDatabase(response.stats);
        } else {
          console.error('API returned success=false');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading admin stats:', error);
        this.loading = false;
        // Keep default values on error
      }
    });
  }

  private updateStatsFromDatabase(dbStats: AdminStats): void {
    // Update Total Mechanics
    this.stats[0].value = dbStats.totalMechanics.value.toString();
    this.stats[0].trend = dbStats.totalMechanics.trend;
    this.stats[0].change = `${dbStats.totalMechanics.change}%`;
    this.stats[0].period = dbStats.totalMechanics.period;

    // Update New Bookings
    this.stats[1].value = dbStats.newBookings.value.toString();
    this.stats[1].trend = dbStats.newBookings.trend;
    this.stats[1].change = `${dbStats.newBookings.change}%`;
    this.stats[1].period = dbStats.newBookings.period;

    // Update Today Schedules
    this.stats[2].value = dbStats.todaySchedules.value.toString();
    this.stats[2].trend = dbStats.todaySchedules.trend;
    this.stats[2].change = `${dbStats.todaySchedules.change}%`;
    this.stats[2].period = dbStats.todaySchedules.period;
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h3 class="text-xl font-semibold text-dark">Recent Activity</h3>
          <p class="text-sm text-gray-500">Latest system activities</p>
        </div>
        <div class="relative">
          <select [(ngModel)]="activityFilter" (change)="filterActivities()"
                  class="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            <option value="all">All Activities</option>
            <option value="booking">Bookings</option>
            <option value="service">Services</option>
            <option value="payment">Payments</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-500 text-xs"></i>
        </div>
      </div>

      <div class="activity-timeline space-y-6">
        <!-- Today's Activities -->
        <div *ngIf="filteredActivities.today.length > 0">
          <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
            <span class="bg-primary w-3 h-3 rounded-full mr-2"></span>
            Today
          </h4>
          
          <div class="relative pl-6 border-l-2 border-primary space-y-4">
            <div *ngFor="let activity of filteredActivities.today" 
                 class="activity-item group" 
                 [attr.data-type]="activity.type"
                 (click)="navigateToActivity(activity)">
              <div class="absolute -left-[18px] top-0 rounded-full w-4 h-4 flex items-center justify-center mt-1.5"
                   [ngClass]="{
                     'bg-primary': activity.type === 'booking',
                     'bg-green-500': activity.type === 'service',
                     'bg-purple-500': activity.type === 'payment'
                   }">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div class="pl-4">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p class="font-medium text-gray-800">{{activity.title}}</p>
                    <p class="text-sm text-gray-600">{{activity.description}}</p>
                  </div>
                  <span class="text-xs text-gray-500 sm:whitespace-nowrap">{{activity.time}}</span>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span *ngFor="let tag of activity.tags" 
                        class="px-2 py-1 rounded"
                        [ngClass]="{
                          'bg-blue-100 text-blue-800': tag.type === 'booking',
                          'bg-green-100 text-green-800': tag.type === 'service',
                          'bg-purple-100 text-purple-800': tag.type === 'payment'
                        }">
                    {{tag.text}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Yesterday's Activities -->
        <div *ngIf="filteredActivities.yesterday.length > 0">
          <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
            <span class="bg-gray-300 w-3 h-3 rounded-full mr-2"></span>
            Yesterday
          </h4>
          
          <div class="relative pl-6 border-l-2 border-gray-200 space-y-4">
            <div *ngFor="let activity of filteredActivities.yesterday" 
                 class="activity-item group" 
                 [attr.data-type]="activity.type"
                 (click)="navigateToActivity(activity)">
              <div class="absolute -left-[18px] top-0 rounded-full w-4 h-4 flex items-center justify-center mt-1.5"
                   [ngClass]="{
                     'bg-primary': activity.type === 'booking',
                     'bg-green-500': activity.type === 'service',
                     'bg-purple-500': activity.type === 'payment'
                   }">
                <div class="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div class="pl-4">
                <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p class="font-medium text-gray-800">{{activity.title}}</p>
                    <p class="text-sm text-gray-600">{{activity.description}}</p>
                  </div>
                  <span class="text-xs text-gray-500 sm:whitespace-nowrap">{{activity.time}}</span>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span *ngFor="let tag of activity.tags" 
                        class="px-2 py-1 rounded"
                        [ngClass]="{
                          'bg-blue-100 text-blue-800': tag.type === 'booking',
                          'bg-green-100 text-green-800': tag.type === 'service',
                          'bg-purple-100 text-purple-800': tag.type === 'payment'
                        }">
                    {{tag.text}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .activity-item {
      position: relative;
      padding: 12px;
      border-radius: 8px;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    
    .activity-item:hover {
      background-color: #f8fafc;
      transform: translateX(2px);
    }
    
    .activity-item::before {
      content: '';
      position: absolute;
      left: -2px;
      top: 0;
      height: 100%;
      width: 2px;
      background-color: transparent;
      transition: background-color 0.2s ease;
    }
    
    .activity-item:hover::before {
      background-color: var(--primary);
    }
    
    :host {
      --primary: #1B4B88;
    }
    
    @media (max-width: 640px) {
      .activity-timeline {
        padding-left: 0.5rem;
      }
      
      .activity-item {
        padding-left: 0.5rem;
      }
    }
  `]
})
export class RecentActivityComponent {
  activityFilter = 'all';
  
  activities = [
    {
      type: 'booking',
      title: 'New booking created',
      description: 'Full Service for Honda City',
      time: '10:30 AM',
      date: new Date(),
      tags: [
        { type: 'booking', text: '#BK107' },
        { type: 'text', text: 'Amit Patel' },
        { type: 'text', text: 'DL8CAB1234' }
      ]
    },
    {
      type: 'service',
      title: 'Service completed',
      description: 'AC Repair for Hyundai i20',
      time: '1:45 PM',
      date: new Date(),
      tags: [
        { type: 'service', text: '#BK106' },
        { type: 'text', text: 'Rajesh Kumar (Mechanic)' },
        { type: 'text', text: 'DL7CXY5678' }
      ]
    },
    {
      type: 'payment',
      title: 'Payment received',
      description: '₹3,500 for Full Service',
      time: '4:30 PM',
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      tags: [
        { type: 'payment', text: 'Cash' },
        { type: 'text', text: 'Receipt #RCT789' },
        { type: 'text', text: 'Priya Sharma' }
      ]
    }
  ];
  
  filteredActivities = {
    today: [] as any[],
    yesterday: [] as any[]
  };
  
  constructor() {
    this.filterActivities();
  }
  
  filterActivities(): void {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    this.filteredActivities.today = this.activities
      .filter(act => 
        (this.activityFilter === 'all' || act.type === this.activityFilter) &&
        act.date.toDateString() === today.toDateString()
      );
      
    this.filteredActivities.yesterday = this.activities
      .filter(act => 
        (this.activityFilter === 'all' || act.type === this.activityFilter) &&
        act.date.toDateString() === yesterday.toDateString()
      );
  }
  
  navigateToActivity(activity: any): void {
    // In a real app, this would navigate to the relevant details page
    console.log('Navigating to activity:', activity);
  }
}

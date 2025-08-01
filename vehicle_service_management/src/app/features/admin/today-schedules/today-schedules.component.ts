import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-today-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-dark">Today's Schedules</h3>
        <div class="flex items-center space-x-2">
          <input type="date" [(ngModel)]="selectedDate" (change)="loadSchedules()"
                 class="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
          <button (click)="loadSchedules()" class="p-2 text-primary hover:text-primary-dark">
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      
      <div *ngIf="loading" class="text-center py-4">
        <i class="fas fa-spinner fa-spin text-primary mr-2"></i> Loading schedules...
      </div>
      
      <div *ngIf="!loading">
        <div *ngIf="schedules.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-calendar-times text-2xl mb-2"></i>
          <p>No schedules found for this date</p>
        </div>
        
        <div *ngIf="schedules.length > 0" class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="py-3 px-4 text-left text-gray-600">Time</th>
                <th class="py-3 px-4 text-left text-gray-600">Customer</th>
                <th class="py-3 px-4 text-left text-gray-600">Vehicle</th>
                <th class="py-3 px-4 text-left text-gray-600">Service</th>
                <th class="py-3 px-4 text-left text-gray-600">Mechanic</th>
                <th class="py-3 px-4 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let schedule of schedules" class="hover:bg-gray-50">
                <td class="py-3 px-4">{{schedule.time}}</td>
                <td class="py-3 px-4 font-medium">{{schedule.customer}}</td>
                <td class="py-3 px-4">{{schedule.vehicle}}</td>
                <td class="py-3 px-4">{{schedule.service}}</td>
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <img [src]="schedule.mechanicAvatar" alt="Mechanic" class="h-6 w-6 rounded-full mr-2">
                    {{schedule.mechanic}}
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="px-2 py-1 rounded-full text-xs"
                        [ngClass]="{
                          'bg-blue-100 text-blue-800': schedule.status === 'scheduled',
                          'bg-green-100 text-green-800': schedule.status === 'completed'
                        }">
                    {{schedule.status | titlecase}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #1B4B88;
      --primary-dark: #0D3A6E;
    }
  `]
})
export class TodaySchedulesComponent implements OnInit {
  selectedDate: string;
  loading = false;
  schedules: any[] = [];
  
  constructor(private datePipe: DatePipe) {
    this.selectedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
  }
  
  ngOnInit(): void {
    this.loadSchedules();
  }
  
  loadSchedules(): void {
    this.loading = true;
    this.schedules = [];
    
    // Simulate API call
    setTimeout(() => {
      if (this.selectedDate === this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
        this.schedules = [
          {
            id: "SC101",
            time: "10:00 AM - 11:30 AM",
            customer: "Balaji",
            vehicle: "Honda City (DL8CAB1234)",
            service: "Full Service",
            mechanic: "Rajesh Kumar",
            mechanicAvatar: "https://ui-avatars.com/api/?name=R+Kumar",
            status: "scheduled"
          },
          {
            id: "SC102",
            time: "11:30 AM - 12:30 PM",
            customer: "Priya",
            vehicle: "Hyundai i20 (DL7CXY5678)",
            service: "AC Service",
            mechanic: "Vikram Singh",
            mechanicAvatar: "https://ui-avatars.com/api/?name=V+Singh",
            status: "completed"
          }
        ];
      }
      this.loading = false;
    }, 800);
  }
}

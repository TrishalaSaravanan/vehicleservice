import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Booking {
  id: string;
  customer: {
    name: string;
    phone: string;
    avatar: string;
  };
  service: string;
  time: string;
  date: string;
  status: 'new' | 'assigned' | 'completed';
  mechanic?: string;
}

@Component({
  selector: 'app-recent-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-6 rounded-xl shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-dark">Recent Bookings</h3>
        <div class="relative">
          <select [(ngModel)]="statusFilter" (change)="filterBookings()"
                  class="appearance-none bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm">
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
          </select>
          <i class="fas fa-chevron-down absolute right-3 top-3 text-gray-500 text-xs"></i>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b">
              <th class="py-3 px-4 text-left text-gray-600">Booking ID</th>
              <th class="py-3 px-4 text-left text-gray-600">Customer</th>
              <th class="py-3 px-4 text-left text-gray-600">Service</th>
              <th class="py-3 px-4 text-left text-gray-600">Date/Time</th>
              <th class="py-3 px-4 text-left text-gray-600">Status</th>
              <th class="py-3 px-4 text-left text-gray-600">Assign</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr *ngFor="let booking of filteredBookings" class="hover:bg-gray-50">
              <td class="py-3 px-4 font-medium">{{booking.id}}</td>
              <td class="py-3 px-4">
                <div class="flex items-center">
                  <img [src]="booking.customer.avatar" alt="Customer" class="h-8 w-8 rounded-full mr-2">
                  <div>
                    <p>{{booking.customer.name}}</p>
                    <p class="text-xs text-gray-500">{{booking.customer.phone}}</p>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">{{booking.service}}</td>
              <td class="py-3 px-4">
                <p>{{booking.time}}</p>
                <p class="text-xs text-gray-500">{{booking.date}}</p>
              </td>
              <td class="py-3 px-4">
                <span class="px-3 py-1 rounded-full text-xs"
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': booking.status === 'new',
                        'bg-green-100 text-green-800': booking.status === 'assigned',
                        'bg-gray-100 text-gray-800': booking.status === 'completed'
                      }">
                  {{booking.status === 'assigned' ? 'Assigned to ' + booking.mechanic : booking.status | titlecase}}
                </span>
              </td>
              <td class="py-3 px-4">
                <button *ngIf="booking.status === 'new'" (click)="assignMechanic(booking)"
                        class="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition">
                  Assign
                </button>
                <button *ngIf="booking.status === 'assigned'" disabled
                        class="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm">
                  Assigned
                </button>
                <span *ngIf="booking.status === 'completed'" class="text-gray-400 text-sm">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="text-center mt-4">
        <button (click)="toggleViewAll()" class="text-primary hover:text-primary-dark font-medium text-sm">
          {{showAll ? 'Show Recent Only' : 'View All Bookings'}} <i class="fas fa-chevron-right ml-1"></i>
        </button>
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
export class RecentBookingsComponent {
  statusFilter = 'all';
  showAll = false;
  
  bookings: Booking[] = [
    {
      id: '#BK105',
      customer: {
        name: 'Amit Patel',
        phone: '9876543210',
        avatar: 'https://ui-avatars.com/api/?name=A+Patel'
      },
      service: 'Full Service',
      time: 'Today, 10:00 AM',
      date: '12 Jul 2023',
      status: 'new',
      mechanic: ''
    },
    {
      id: '#BK104',
      customer: {
        name: 'Priya Sharma',
        phone: '8765432109',
        avatar: 'https://ui-avatars.com/api/?name=P+Sharma'
      },
      service: 'AC Repair',
      time: 'Today, 2:30 PM',
      date: '12 Jul 2023',
      status: 'assigned',
      mechanic: 'Rajesh'
    },
    {
      id: '#BK103',
      customer: {
        name: 'Rahul Kumar',
        phone: '7654321098',
        avatar: 'https://ui-avatars.com/api/?name=R+Kumar'
      },
      service: 'Oil Change',
      time: 'Yesterday, 11:00 AM',
      date: '11 Jul 2023',
      status: 'completed',
      mechanic: 'Vikram'
    }
  ];
  
  filteredBookings: Booking[] = [...this.bookings];
  
  filterBookings(): void {
    if (this.statusFilter === 'all') {
      this.filteredBookings = this.showAll ? [...this.bookings] : this.bookings.slice(0, 2);
    } else {
      this.filteredBookings = this.bookings.filter(b => b.status === this.statusFilter);
    }
  }
  
  toggleViewAll(): void {
    this.showAll = !this.showAll;
    this.filterBookings();
  }
  
  assignMechanic(booking: Booking): void {
    if (confirm(`Assign mechanic to booking ${booking.id}?`)) {
      booking.status = 'assigned';
      booking.mechanic = 'Rajesh';
      this.filterBookings();
    }
  }
}

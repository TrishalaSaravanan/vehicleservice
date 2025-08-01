import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';

interface ServiceItem {
  name: string;
  description: string;
  quantity: string;
  price: string;
  total: string;
}

interface Attachment {
  name: string;
  type: string;
  size: string;
}

interface Customer {
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface Vehicle {
  make: string;
  model: string;
  year: string;
  vin: string;
  mileage: string;
}

interface Service {
  id: string;
  customer: Customer;
  vehicle: Vehicle;
  serviceType: string;
  date: string;
  actualDate: Date;
  amount: string;
  status: string;
  completionStatus: string;
  items: ServiceItem[];
  notes: string;
  attachments: Attachment[];
}

@Component({
  selector: 'app-service-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './service-history.component.html',
  styleUrls: ['./service-history.component.css']
})
export class ServiceHistoryComponent implements OnInit {
  mechanicName: string = '';
  
  // Filter states
  searchTerm = '';
  timePeriodFilter = 'all';
  serviceTypeFilter = 'all';
  statusFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  
  // Modal states
  showServiceDetails = false;
  selectedService: Service | null = null;
  showMobileMenu = false;
  showNotifications = false;
  notificationCount = 2;
  
  // Sample notifications
  notifications = [
    {
      id: '1',
      title: 'New appointment scheduled',
      description: 'Today at 2:30 PM - Oil change for Priya\'s Honda City',
      icon: 'fas fa-calendar-check',
      iconBg: 'bg-blue-100 text-blue-600',
      timestamp: 'Just now'
    },
    {
      id: '2',
      title: 'Payment received',
      description: '₹5,500 for SV-2023-0140 (Tire Rotation)',
      icon: 'fas fa-rupee-sign',
      iconBg: 'bg-green-100 text-green-600',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      title: 'Part low in stock',
      description: 'Only 2 units of Bosch Oil Filter left',
      icon: 'fas fa-exclamation-circle',
      iconBg: 'bg-yellow-100 text-yellow-600',
      timestamp: '3 hours ago'
    }
  ];

  services: Service[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.fetchCompletedServices();
  }

  fetchCompletedServices() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments: any[]) => {
        // Filter for completed appointments and map to Service[]
        this.services = appointments
          .filter(a => a.status === 'Completed')
          .map(a => ({
            id: a.id,
            customer: { name: a.customer_name, phone: a.customer_phone, email: '', address: a.customer_address },
            vehicle: { make: a.vehicle_make, model: a.vehicle_model, year: a.vehicle_year, vin: a.vin, mileage: a.mileage },
            serviceType: a.service_name,
            date: a.appointment_date,
            actualDate: new Date(a.appointment_date),
            amount: a.price,
            status: a.status,
            completionStatus: a.status,
            items: [],
            notes: a.notes,
            attachments: []
          }));
      },
      error: (err: any) => {
        console.error('Failed to fetch completed services:', err);
      }
    });
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Filter methods
  get filteredServices(): Service[] {
    let filtered = [...this.services];
    
    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.id.toLowerCase().includes(searchLower) ||
        service.customer.name.toLowerCase().includes(searchLower) ||
        service.vehicle.make.toLowerCase().includes(searchLower) ||
        service.vehicle.model.toLowerCase().includes(searchLower) ||
        service.serviceType.toLowerCase().includes(searchLower)
      );
    }

    // Filter by time period
    if (this.timePeriodFilter !== 'all') {
      const days = parseInt(this.timePeriodFilter);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(service => 
        service.actualDate >= cutoffDate
      );
    }

    // Filter by service type
    if (this.serviceTypeFilter !== 'all') {
      filtered = filtered.filter(service => 
        service.serviceType === this.serviceTypeFilter
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(service => 
        service.status === this.statusFilter
      );
    }

    return filtered;
  }

  // Pagination methods
  get paginatedServices(): Service[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredServices.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredServices.length / this.itemsPerPage);
  }

  get startItem(): number {
    return this.filteredServices.length > 0 ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0;
  }

  get endItem(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredServices.length);
  }

  get totalItems(): number {
    return this.filteredServices.length;
  }

  get pageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Filter methods
  applyFilters(): void {
    this.currentPage = 1; // Reset to first page when filters change
  }

  // Service detail methods
  showServiceDetailsModal(service: Service): void {
    this.selectedService = service;
    this.showServiceDetails = true;
  }

  hideServiceDetailsModal(): void {
    this.showServiceDetails = false;
    this.selectedService = null;
  }

  // Utility methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending Payment':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAttachmentIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return 'fas fa-file-pdf text-blue-600';
      case 'image':
        return 'fas fa-image text-green-600';
      default:
        return 'fas fa-file text-gray-600';
    }
  }

  getAttachmentIconBg(type: string): string {
    switch (type) {
      case 'pdf':
        return 'bg-blue-100';
      case 'image':
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  }

  // Action methods
  printInvoice(serviceId: string): void {
    if (serviceId === 'current' && this.selectedService) {
      alert('Printing invoice for service: ' + this.selectedService.id);
    } else {
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        alert(`Printing invoice for service: ${serviceId}\nCustomer: ${service.customer.name}\nAmount: ${service.amount}`);
      }
    }
  }

  sendInvoice(serviceId: string): void {
    if (serviceId === 'current' && this.selectedService) {
      alert('Sending invoice for service: ' + this.selectedService.id + ' to customer email');
    } else {
      const service = this.services.find(s => s.id === serviceId);
      if (service) {
        alert(`Sending invoice for service: ${serviceId} to ${service.customer.email}`);
      }
    }
  }

  // Navigation methods
  navigateToProfile(): void {
    this.router.navigate(['/mechanic/profile']);
  }

  // Logout methods
  confirmLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Mechanic logout requested');
      this.authService?.logout();
    }
  }
}

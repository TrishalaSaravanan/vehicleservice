import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AppointmentService } from '../../../services/appointment.service';

interface Job {
  id: string;
  title: string;
  vehicle: string;
  customer: string;
  status: string;
  dueDate: string;
  assignedTime?: string;
  adminNotes?: string;
  rating?: string;
}

interface Appointment {
  time: string;
  service: string;
  customer: string;
  vehicle: string;
}

interface Notification {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-mechanic-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './mechanic-dashboard-clean.component.html',
  styleUrl: './mechanic-dashboard-clean.component.css'
})
export class MechanicDashboardComponent implements OnInit {
  // Stats (matching the provided design)
  pendingJobs = 3;
  inProgress = 5;
  completedToday = 12;
  avgRating = 4.8;
  totalJobs = 8;

  // Pagination properties (like admin service management)
  currentPage = 1;
  pageSize = 5;
  searchTerm = '';
  statusFilter = '';

  // Modal states
  showAcceptModal = false;
  showUpdateForm = false;
  showCustomerModal = false;
  showLogoutModal = false;
  selectedJobId: string | null = null;
  selectedJob: Job | null = null;

  // Notifications
  showNotifications = false;
  notificationCount = 3;
  notifications: Notification[] = [
    {
      title: 'New Work Order',
      description: 'Brake repair for Toyota Camry assigned',
      icon: 'fas fa-wrench text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Part Request Approved',
      description: 'Brake pads order approved',
      icon: 'fas fa-check text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Schedule Update',
      description: 'Tomorrow schedule updated',
      icon: 'fas fa-calendar text-orange-600',
      iconBg: 'bg-orange-100'
    }
  ];

  // Sample Parts Inventory Data
  partsInventory: any[] = [
    {
      id: 1,
      name: 'Brake Pads',
      partNumber: 'BP-001',
      category: 'Brakes',
      quantity: 15,
      minStock: 5,
      price: 45.99,
      status: 'Available'
    },
    {
      id: 2,
      name: 'Oil Filter',
      partNumber: 'OF-002',
      category: 'Engine',
      quantity: 3,
      minStock: 5,
      price: 12.50,
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Air Filter',
      partNumber: 'AF-003',
      category: 'Engine',
      quantity: 0,
      minStock: 3,
      price: 18.75,
      status: 'Out of Stock'
    },
    {
      id: 4,
      name: 'Spark Plugs',
      partNumber: 'SP-004',
      category: 'Engine',
      quantity: 24,
      minStock: 8,
      price: 8.99,
      status: 'Available'
    },
    {
      id: 5,
      name: 'Transmission Fluid',
      partNumber: 'TF-005',
      category: 'Fluids',
      quantity: 12,
      minStock: 4,
      price: 22.50,
      status: 'Available'
    },
    {
      id: 6,
      name: 'Battery',
      partNumber: 'BT-006',
      category: 'Electrical',
      quantity: 2,
      minStock: 3,
      price: 125.00,
      status: 'Low Stock'
    }
  ];

  // Sample Service History Data
  serviceHistory: any[] = [
    {
      id: 1,
      date: '2024-07-30',
      customer: 'kumar',
      vehicle: 'Toyota Camry (2020)',
      service: 'Brake System Repair',
      status: 'Completed',
      duration: '2.5 hours',
      parts: ['Brake Pads', 'Brake Fluid'],
      cost: 185.50,
      rating: 5
    },
    {
      id: 2,
      date: '2024-07-29',
      customer: 'Sarah',
      vehicle: 'Honda Civic (2019)',
      service: 'Oil Change',
      status: 'Completed',
      duration: '45 minutes',
      parts: ['Oil Filter', 'Motor Oil'],
      cost: 65.00,
      rating: 4
    },
    {
      id: 3,
      date: '2024-07-28',
      customer: 'Naveen',
      vehicle: 'Ford F-150 (2021)',
      service: 'Tire Rotation',
      status: 'Completed',
      duration: '1 hour',
      parts: [],
      cost: 40.00,
      rating: 5
    },
    {
      id: 4,
      date: '2024-07-27',
      customer: 'Michael',
      vehicle: 'BMW 3 Series (2022)',
      service: 'Engine Diagnostic',
      status: 'Completed',
      duration: '1.5 hours',
      parts: [],
      cost: 120.00,
      rating: 4
    },
    {
      id: 5,
      date: '2024-07-26',
      customer: 'Lisa',
      vehicle: 'Mercedes C-Class (2021)',
      service: 'AC Service',
      status: 'Completed',
      duration: '2 hours',
      parts: ['AC Filter', 'Refrigerant'],
      cost: 150.00,
      rating: 5
    },
    {
      id: 6,
      date: '2024-07-25',
      customer: 'David',
      vehicle: 'Audi A4 (2020)',
      service: 'Transmission Service',
      status: 'Completed',
      duration: '3 hours',
      parts: ['Transmission Fluid', 'Filter'],
      cost: 275.00,
      rating: 4
    }
  ];

  // Sample data with more detailed information
  recentJobs: Job[] = [
    {
      id: 'job1',
      title: 'Brake System Repair',
      vehicle: 'Toyota Camry (2020) - JT2BF22K3W0123456',
      customer: 'kumar',
      status: 'pending',
      dueDate: 'Tomorrow, 5:00 PM',
      assignedTime: 'Today, 10:30 AM',
      adminNotes: 'Customer reports squeaking noise when braking'
    },
    {
      id: 'job2',
      title: 'Oil Change & Filter Replacement',
      vehicle: 'Honda Civic (2019) - 2HGFC2F56KH123456',
      customer: 'Sarah',
      status: 'in-progress',
      dueDate: 'Today, 3:00 PM',
      assignedTime: 'Today, 11:15 AM',
      adminNotes: 'Full synthetic oil requested'
    },
    {
      id: 'job3',
      title: 'Tire Rotation & Alignment',
      vehicle: 'Ford F-150 (2021) - 1FTFW1E5XMK123456',
      customer: 'Naveen',
      status: 'completed',
      dueDate: 'Yesterday, 4:30 PM',
      assignedTime: 'Yesterday, 9:00 AM',
      adminNotes: 'Customer requested premium alignment',
      rating: '5/5'
    }
  ];

  todaySchedule: Appointment[] = [
    {
      time: '9:00 AM',
      service: 'Brake Inspection',
      customer: 'Sarah',
      vehicle: 'BMW X3 (2022)'
    },
    {
      time: '11:00 AM',
      service: 'Oil Change',
      customer: 'Dhyan',
      vehicle: 'Audi A4 (2020)'
    },
    {
      time: '2:00 PM',
      service: 'Tire Rotation',
      customer: 'Ganesh',
      vehicle: 'Mercedes C-Class (2021)'
    }
  ];


  mechanicName: string = '';
  mechanicId: string | null = null;
  appointmentsLoading: boolean = false;
  appointmentsError: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  async ngOnInit(): Promise<void> {
    // Get current user to ensure they're authenticated as a mechanic
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'mechanic') {
      this.router.navigate(['/login']);
      return;
    }

    // Try to get mechanic profile from AuthService
    let profile = this.authService.getMechanicProfile();
    if (!profile || !profile.name) {
      try {
        // Load from backend if not present
        await this.authService.loadMechanicProfile();
        profile = this.authService.getMechanicProfile();
        console.log('Loaded mechanic profile:', profile);
      } catch (error) {
        console.error('Failed to load mechanic profile:', error);
        // Fallback to display email or generic name
        profile = { name: user.email?.split('@')[0] || 'Mechanic' };
      }
    }
    
    this.mechanicName = profile?.name || user.email?.split('@')[0] || 'Mechanic';
    this.mechanicId = profile?.id || null;
    console.log('Mechanic dashboard initialized for:', this.mechanicName, 'ID:', this.mechanicId);
    
    // Load real appointment data if we have mechanic ID
    if (this.mechanicId) {
      await this.loadMechanicAppointments();
    }
  }

  async loadMechanicAppointments(): Promise<void> {
    if (!this.mechanicId) {
      console.error('No mechanic ID available');
      return;
    }

    this.appointmentsLoading = true;
    this.appointmentsError = null;

    try {
      const appointments = await this.appointmentService.getAppointmentsByMechanic(this.mechanicId).toPromise();
      console.log('=== MECHANIC APPOINTMENTS DEBUG ===');
      console.log('Mechanic ID:', this.mechanicId);
      console.log('Mechanic Name:', this.mechanicName);
      console.log('Raw appointments from API:', appointments);
      console.log('Number of appointments found:', appointments?.length || 0);
      
      if (appointments && appointments.length > 0) {
        console.log('Sample appointment data:', appointments[0]);
        
        // Convert appointment data to Job format
        this.recentJobs = appointments.map((appointment: any) => ({
          id: appointment.id.toString(),
          title: appointment.service_name || 'Service Appointment',
          vehicle: `${appointment.vehicle_make} ${appointment.vehicle_model} (${appointment.vehicle_year}) - ${appointment.vehicle_license_plate}`,
          customer: appointment.customer_name,
          status: appointment.status.toLowerCase(),
          dueDate: new Date(appointment.appointment_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          assignedTime: new Date(appointment.created_at || appointment.appointment_date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          adminNotes: appointment.notes || '',
          rating: appointment.rating || ''
        }));

        console.log('Converted to Job format:', this.recentJobs);

        // Update stats based on real data
        this.updateStatsFromAppointments();

        // Update today's schedule
        this.updateTodaySchedule(appointments);
      } else {
        console.log('No appointments found for this mechanic - showing empty state');
        // No appointments found for this mechanic
        this.recentJobs = [];
        this.todaySchedule = [];
        this.updateStatsFromAppointments();
      }

    } catch (error) {
      console.error('Error loading mechanic appointments:', error);
      this.appointmentsError = 'Failed to load appointments. Please try again.';
      // Keep using sample data as fallback
    } finally {
      this.appointmentsLoading = false;
    }
  }

  updateStatsFromAppointments(): void {
    const today = new Date().toDateString();
    
    this.totalJobs = this.recentJobs.length;
    this.pendingJobs = this.recentJobs.filter(job => job.status === 'pending').length;
    this.inProgress = this.recentJobs.filter(job => job.status === 'assigned' || job.status === 'in-progress').length;
    this.completedToday = this.recentJobs.filter(job => 
      job.status === 'completed' && 
      new Date(job.dueDate).toDateString() === today
    ).length;
    
    // Calculate average rating if available
    const ratedJobs = this.recentJobs.filter(job => job.rating && job.rating !== '');
    if (ratedJobs.length > 0) {
      const totalRating = ratedJobs.reduce((sum, job) => {
        const ratingStr = job.rating || '0';
        const rating = parseFloat(ratingStr.split('/')[0] || '0');
        return sum + rating;
      }, 0);
      this.avgRating = totalRating / ratedJobs.length;
    }
  }

  updateTodaySchedule(appointments: any[]): void {
    const today = new Date();
    const todayString = today.toDateString();

    // Filter appointments for today
    const todayAppointments = appointments.filter((appointment: any) => {
      const appointmentDate = new Date(appointment.appointment_date);
      return appointmentDate.toDateString() === todayString;
    });

    // Convert to schedule format
    this.todaySchedule = todayAppointments.map((appointment: any) => ({
      time: new Date(appointment.appointment_date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      service: appointment.service_name || 'Service Appointment',
      customer: appointment.customer_name,
      vehicle: `${appointment.vehicle_make} ${appointment.vehicle_model} (${appointment.vehicle_year})`
    }));
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  filterJobs(): void {
    // Reset to first page when filtering
    this.currentPage = 1;
    console.log('Filtering jobs by status:', this.statusFilter);
  }

  onSearchChange(): void {
    // Reset to first page when searching
    this.currentPage = 1;
  }

  // Filtered jobs based on status filter and search term
  get filteredJobs(): Job[] {
    let filtered = this.recentJobs;

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(term) ||
        job.customer.toLowerCase().includes(term) ||
        job.vehicle.toLowerCase().includes(term) ||
        job.status.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(job => job.status === this.statusFilter);
    }

    return filtered;
  }

  // Paginated jobs for display
  get paginatedJobs(): Job[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredJobs.slice(start, start + this.pageSize);
  }

  // Pagination getters
  get totalPages(): number {
    return Math.ceil(this.filteredJobs.length / this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get showingFrom(): number {
    if (this.filteredJobs.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredJobs.length);
  }

  // Pagination methods
  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Refresh appointments data
  async refreshAppointments(): Promise<void> {
    if (this.mechanicId) {
      await this.loadMechanicAppointments();
    }
  }

  // Job management methods
  showAcceptPopup(jobId: string): void {
    this.selectedJobId = jobId;
    this.showAcceptModal = true;
  }

  hideAcceptPopup(): void {
    this.showAcceptModal = false;
    this.selectedJobId = null;
  }

  acceptJob(): void {
    if (this.selectedJobId) {
      const job = this.recentJobs.find(j => j.id === this.selectedJobId);
      if (job) {
        job.status = 'in-progress';
      }
    }
    this.hideAcceptPopup();
    this.showNotification('Job accepted successfully!', 'success');
  }

  showUpdateJobForm(job: Job): void {
    this.selectedJob = job;
    this.selectedJobId = job.id;
    this.showUpdateForm = true;
  }

  hideUpdateForm(): void {
    this.showUpdateForm = false;
    this.selectedJob = null;
    this.selectedJobId = null;
  }

  saveUpdate(): void {
    this.hideUpdateForm();
    this.showNotification('Job updated successfully!', 'success');
  }

  // Customer details methods
  showCustomerDetailsModal(job: Job): void {
    this.selectedJob = job;
    this.showCustomerModal = true;
  }

  hideCustomerDetails(): void {
    this.showCustomerModal = false;
    this.selectedJob = null;
  }

  // Logout methods
  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  hideLogoutPopup(): void {
    this.showLogoutModal = false;
  }

  performLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Job details for completed jobs
  showJobDetails(job: Job): void {
    console.log('Viewing job details:', job);
    // In a real app, navigate to job details page or show modal
  }

  // Utility methods
  showNotification(message: string, type: string): void {
    // In a real app, implement proper notification system
    console.log(`${type}: ${message}`);
  }

  // Helper methods for template
  getCustomerName(customerString: string): string {
    return customerString.split('(')[0].trim();
  }

  getCustomerPhone(customerString: string): string {
    const match = customerString.match(/\((.*?)\)/);
    return match ? match[1] : 'N/A';
  }

  getCustomerEmail(customerString: string): string {
    const name = this.getCustomerName(customerString);
    return name.toLowerCase().replace(' ', '.') + '@example.com';
  }

  getVehicleName(vehicleString: string): string {
    return vehicleString.split(' - ')[0];
  }

  getVehicleVin(vehicleString: string): string {
    const parts = vehicleString.split(' - ');
    return parts.length > 1 ? parts[1] : 'N/A';
  }
}

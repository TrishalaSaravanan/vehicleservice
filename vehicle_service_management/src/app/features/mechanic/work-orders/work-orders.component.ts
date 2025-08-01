import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FileUrlPipe } from './file-url.pipe';
import { AppointmentService } from '../../../services/appointment.service'; // Import AppointmentService

@Component({
  selector: 'app-work-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FileUrlPipe],
  templateUrl: './work-orders.component.html',
  styleUrls: ['./work-orders.component.css']
})
export class WorkOrdersComponent implements OnInit {
  showCompleteModal: boolean = false;
  orderToComplete: WorkOrder | null = null;

  // ...existing properties and constructor...

  showCompleteConfirmModal(order?: WorkOrder) {
    this.showCompleteModal = true;
    this.orderToComplete = order || this.selectedOrder;
  }

  hideCompleteConfirmModal() {
    this.showCompleteModal = false;
    this.orderToComplete = null;
  }

  confirmCompleteOrder() {
    if (!this.orderToComplete || !this.orderToComplete.id) return;
    this.appointmentService.updateAppointmentStatus(Number(this.orderToComplete.id), 'Completed').subscribe({
      next: () => {
        const profile = this.authService.getMechanicProfile();
        this.loadWorkOrders(profile?.id);
        this.hideOrderDetails();
        this.hideCompleteConfirmModal();
      },
      error: (err: any) => {
        console.error('Failed to complete order:', err);
      }
    });
  }
  // Add availableParts property for template compatibility
  availableParts: string[] = [];
  // Modal properties
  selectedOrder: WorkOrder | null = null;
  showOrderDetailsModal: boolean = false;
  showAcceptModal: boolean = false;
  showPartsModal: boolean = false;
  showLogoutModal: boolean = false;
  showUpdateModal: boolean = false;

  // UI state
  showMobileMenu: boolean = false;
  showNotifications: boolean = false;

  // Form data
  customerNotification: string = '';

  // Update modal state
  updateHoursWorked: string = '';
  updateSelectedPart: string = '';
  updatePartsUsed: string[] = [];
  updateNotes: string = '';
  updateImages: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  mechanicName: string = '';

  workOrders: WorkOrder[] = [];
  filteredOrders: WorkOrder[] = [];
  paginatedOrders: WorkOrder[] = [];

  constructor(public authService: AuthService, private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    // Get mechanic name and ID from AuthService
    const profile = this.authService.getMechanicProfile();
    this.mechanicName = profile ? profile.name : 'Mechanic';
    this.loadWorkOrders(profile?.id);
  }

  loadWorkOrders(mechanicId?: string) {
    if (!mechanicId) return;
    this.appointmentService.getAppointmentsByMechanic(mechanicId).subscribe((orders: any[]) => {
      // Map backend fields to frontend expected fields
      this.workOrders = (orders || []).map(order => ({
        id: order.id,
        orderNumber: order.order_number || order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerEmail: order.customer_email,
        customerAddress: order.customer_address,
        vehicleInfo: `${order.vehicle_make || ''} ${order.vehicle_model || ''} ${order.vehicle_year || ''}`.trim(),
        vin: order.vin,
        mileage: order.mileage,
        licensePlate: order.vehicle_license_plate,
        serviceType: order.service_name,
        description: order.service_description,
        notes: order.notes, // Map customer notes here
        status: order.status,
        dueDate: order.appointment_date,
        createdDate: order.created_at || order.appointment_date,
        assignedMechanic: order.mechanic_name,
        estimatedCost: order.price,
        actualCost: order.actual_cost,
        priority: order.priority || 'normal',
        requiredParts: order.required_parts || [],
        statusHistory: order.status_history || [],
        partsUsed: order.parts_used || [],
        hoursWorked: order.hours_worked,
        images: order.images || []
      }));
      this.filteredOrders = [...this.workOrders];
      this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
      this.updatePaginatedOrders();
      this.availableParts = Array.from(new Set(this.workOrders.flatMap(order => order.requiredParts?.map((part: any) => part.name) || [])));
    });
  }

  updatePaginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  // UI Methods
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }
  // ...existing code...

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedOrders();
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getStartIndex(): number {
    return ((this.currentPage - 1) * this.itemsPerPage) + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  // Status styling methods
  getStatusClass(status: string): string {
    const baseClass = 'status-badge ';
    switch (status) {
      case 'pending': return baseClass + 'status-pending';
      case 'in_progress': return baseClass + 'status-in_progress';
      case 'waiting_for_parts': return baseClass + 'status-waiting_for_parts';
      case 'completed': return baseClass + 'status-completed';
      default: return baseClass + 'status-pending';
    }
  }

  getPartStatusClass(status: string): string {
    const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ';
    switch (status) {
      case 'in_stock': return baseClass + 'bg-green-100 text-green-800';
      case 'ordered': return baseClass + 'bg-yellow-100 text-yellow-800';
      case 'shipped': return baseClass + 'bg-blue-100 text-blue-800';
      case 'delivered': return baseClass + 'bg-purple-100 text-purple-800';
      case 'installed': return baseClass + 'bg-green-100 text-green-800';
      default: return baseClass + 'bg-gray-100 text-gray-800';
    }
  }

  getPartProgressClass(status: string): string {
    switch (status) {
      case 'ordered': return 'bg-yellow-600';
      case 'shipped': return 'bg-blue-600';
      case 'delivered': return 'bg-purple-600';
      case 'installed': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  }

  getPartProgress(status: string): string {
    switch (status) {
      case 'ordered': return '25%';
      case 'shipped': return '50%';
      case 'delivered': return '75%';
      case 'installed': return '100%';
      default: return '0%';
    }
  }

  // Modal methods
  showOrderDetails(order: WorkOrder) {
    this.selectedOrder = order;
    this.showOrderDetailsModal = true;
  }

  hideOrderDetails() {
    this.showOrderDetailsModal = false;
    this.selectedOrder = null;
  }

  showAcceptPopup(order: WorkOrder) {
    this.selectedOrder = order;
    this.showAcceptModal = true;
  }

  hideAcceptPopup() {
    this.showAcceptModal = false;
    this.selectedOrder = null;
  }

  showPartsStatus(order: WorkOrder) {
    this.selectedOrder = order;
    this.showPartsModal = true;
  }

  hidePartsStatus() {
    this.showPartsModal = false;
    this.selectedOrder = null;
  }

  showUpdateForm(order: WorkOrder) {
    this.selectedOrder = { ...order };
    this.showUpdateModal = true;
    this.updateHoursWorked = order['hoursWorked'] || '';
    this.updateSelectedPart = '';
    this.updatePartsUsed = order['partsUsed'] ? [...order['partsUsed']] : [];
    this.updateNotes = order['description'] || '';
    this.updateImages = [];
  }

  completeOrder(order: WorkOrder) {
    if (!order) return;
    this.appointmentService.updateAppointmentStatus(Number(order.id), 'Completed').subscribe({
      next: () => {
        this.loadWorkOrders(); // reload mechanic's work orders
        this.hideOrderDetails();
      },
      error: (err) => {
        // Optionally show error message
        console.error('Failed to complete order:', err);
      }
    });
  }

  hideUpdateModal() {
    this.showUpdateModal = false;
    this.selectedOrder = null;
  }

  addPartUsed() {
    if (this.updateSelectedPart && !this.updatePartsUsed.includes(this.updateSelectedPart)) {
      this.updatePartsUsed.push(this.updateSelectedPart);
      this.updateSelectedPart = '';
    }
  }

  removePartUsed(part: string) {
    this.updatePartsUsed = this.updatePartsUsed.filter(p => p !== part);
  }

  onImageSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.updateImages.push(files[i]);
    }
  }

  saveOrderUpdate() {
    if (!this.selectedOrder) return;
    const idx = this.workOrders.findIndex(o => o.id === this.selectedOrder!.id);
    if (idx !== -1) {
      this.workOrders[idx] = {
        ...this.selectedOrder,
        hoursWorked: this.updateHoursWorked,
        partsUsed: [...this.updatePartsUsed],
        description: this.updateNotes,
        images: this.updateImages
      };
      // Removed filterWorkOrders reference
      this.updatePaginatedOrders();
    }
    this.hideUpdateModal();
  }

  showInvoice(order: WorkOrder) {
    // Implement invoice display logic
    console.log('Show invoice for order:', order.orderNumber);
  }

  // Action methods
  acceptOrder() {
    if (this.selectedOrder) {
      this.selectedOrder.status = 'in_progress';
      this.selectedOrder.statusHistory.push({
        date: new Date().toISOString().split('T')[0],
        action: 'Order Accepted',
        details: 'Work order accepted by mechanic',
        performedBy: this.mechanicName
      });
      // Removed filterWorkOrders reference
      this.hideAcceptPopup();
    }
  }

  sendCustomerUpdate() {
    if (this.selectedOrder && this.customerNotification) {
      // Implement customer notification logic
      console.log('Sending customer update:', this.customerNotification);
      this.customerNotification = '';
      this.hidePartsStatus();
    }
  }

  printOrder() {
    if (this.selectedOrder) {
      // Implement print logic
      console.log('Printing order:', this.selectedOrder.orderNumber);
      window.print();
    }
  }

  // Logout methods
  confirmLogout() {
    this.showLogoutModal = true;
  }

  hideLogoutPopup() {
    this.showLogoutModal = false;
  }

  performLogout() {
    console.log('Mechanic logout requested');
    this.authService.logout();
    this.hideLogoutPopup();
  }

  isFile(obj: any): boolean {
    return obj instanceof File;
  }
}

interface Part {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  cost?: number;
  status: string;
  supplier: string;
  estimatedDelivery: string;
}

interface StatusEvent {
  date: string;
  action: string;
  details: string;
  performedBy: string;
}

interface WorkOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  vehicleInfo: string;
  vin: string;
  mileage: number;
  licensePlate: string;
  serviceType: string;
  description: string;
  status: string;
  dueDate: string;
  createdDate: string;
  assignedMechanic: string;
  estimatedCost: number;
  actualCost?: number;
  priority: string;
  requiredParts: Part[];
  statusHistory: StatusEvent[];
  partsUsed?: string[];
  hoursWorked?: string;
  images?: any[];
  notes?: string; // Added notes property
}

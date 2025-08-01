import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, NgClass, DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ServiceService, Service } from '../../../services/service.service';
import { AppointmentService } from '../../../services/appointment.service';
import { MechanicService } from '../../../services/mechanic.service';
import { PartsService, Part } from '../../../services/parts.service';

@Component({
  selector: 'app-service-management',
  standalone: true,
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'],
  imports: [NgIf, NgFor, NgClass, DecimalPipe, CurrencyPipe, FormsModule, DatePipe]
})
export class ServiceManagementComponent implements OnInit {
  // Map backend part model to template fields
  get mappedPaginatedParts() {
    return this.paginatedParts.map(part => ({
      ...part,
      name: part.name,
      category: part.category,
      stock: part.stock,
      status: part.status
    }));
  }

  getPartStatus(stock: number, minStock: number): string {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'Available';
  }
  // Utility for status badge
  getStatusClass(status: string): string {
    switch (status) {
      case 'Accepted':
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'Pending':
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'Rejected':
      case 'Out of Stock':
        return 'bg-red-100 text-red-700 border-red-400';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'Completed':
        return 'bg-gray-200 text-gray-800 border-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  // Utility for part icon (FontAwesome or similar)
  getPartIcon(category: string): string {
    switch (category) {
      case 'Engine': return 'fas fa-cogs';
      case 'Brakes': return 'fas fa-car-crash';
      case 'Suspension': return 'fas fa-car-side';
      case 'Electrical': return 'fas fa-bolt';
      case 'Filters': return 'fas fa-filter';
      case 'Fluids': return 'fas fa-tint';
      case 'Exterior': return 'fas fa-car';
      case 'Interior': return 'fas fa-chair';
      default: return 'fas fa-cube';
    }
  }

  // Edit part modal logic
  openEditPartModal(part: Part) {
    this.editPart = { ...part };
    this.showEditPartModal = true;
  }
  closeEditPartModal() {
    this.showEditPartModal = false;
    this.editPart = null;
  }

  // Pagination logic
  goToPartsPage(page: number) {
    this.partsCurrentPage = page;
  }
  nextPartsPage() {
    if (this.partsCurrentPage < this.partsTotalPages) {
      this.partsCurrentPage++;
    }
  }

  // Service Requests Pagination Methods
  goToRequestsPage(page: number) {
    this.requestsCurrentPage = page;
  }

  nextRequestsPage() {
    if (this.requestsCurrentPage < this.requestsTotalPages) {
      this.requestsCurrentPage++;
    }
  }

  prevRequestsPage() {
    if (this.requestsCurrentPage > 1) {
      this.requestsCurrentPage--;
    }
  }

  onRequestsSearchChange() {
    this.requestsCurrentPage = 1;
  }

  onRequestsStatusChange() {
    this.requestsCurrentPage = 1;
  }

  // Service Catalog Pagination Methods
  goToCatalogPage(page: number) {
    this.catalogCurrentPage = page;
  }

  nextCatalogPage() {
    if (this.catalogCurrentPage < this.catalogTotalPages) {
      this.catalogCurrentPage++;
    }
  }

  prevCatalogPage() {
    if (this.catalogCurrentPage > 1) {
      this.catalogCurrentPage--;
    }
  }

  onCatalogSearchChange() {
    this.catalogCurrentPage = 1;
  }

  onCatalogSortChange() {
    this.catalogCurrentPage = 1;
  }

  // Accept/Reject logic for requests
  acceptRequest(req: any) {
    if (!window.confirm('Are you sure you want to accept and assign this request?')) {
      return;
    }
    // Find mechanic by name and get ID
    const mechanic = this.mechanics.find(m => m.name === req.mechanic);
    const mechanic_id = mechanic ? mechanic.id : undefined;
    // Send mechanic_id to backend, not name
    this.appointmentService.updateAppointmentStatus(req.id, 'Accepted', mechanic_id).subscribe({
      next: () => {
        this.fetchRequests();
        this.closeViewModal();
      },
      error: () => {
        alert('Failed to update status.');
      }
    });
  }

  rejectRequest(req: any) {
    this.appointmentService.updateAppointmentStatus(req.id, 'Rejected').subscribe({
      next: () => {
        this.fetchRequests();
        this.closeViewModal();
      },
      error: () => {
        alert('Failed to update status.');
      }
    });
  }
  assignMechanic() {
    if (!this.assignRequest || !this.assignMechanicId) return;
    const reqIdx = this.requests.findIndex(r => r.id === this.assignRequest.id);
    const mechanic = this.mechanics.find(m => m.id === this.assignMechanicId);
    if (reqIdx > -1 && mechanic) {
      this.requests[reqIdx] = {
        ...this.requests[reqIdx],
        mechanic: mechanic.name,
        status: 'Assigned'
      };
    }
    this.closeAssignModal();
  }
  // --- Parts Inventory State ---
  showAddPartModal = false;
  showEditPartModal = false;
  newPart: any = {
    name: '',
    number: '',
    category: '',
    compatibility: '',
    stock: 0,
    minStock: 0,
    price: 0,
    description: ''
  };
  editPart: any = null;

  // UI state for filters, search, sort, pagination
  partsSearchTerm = '';
  partsCategoryFilter = 'all';
  partsStatusFilter = 'all';
  partsSortFilter = 'name-asc';
  partsCurrentPage = 1;
  partsPageSize = 5;

  // --- Modal Logic ---
  openAddPartModal() {
    this.newPart = {
      name: '', number: '', category: '', compatibility: '', stock: 0, minStock: 0, price: 0, description: ''
    };
    this.showAddPartModal = true;
  }
  closeAddPartModal() {
    this.showAddPartModal = false;
  }
  // ...existing code...

  // --- Data Model ---
  // ...existing code...

  // --- Filtering, Sorting, Pagination ---
  get filteredParts() {
    let filtered = this.parts;
    // Search
    if (this.partsSearchTerm.trim()) {
      const term = this.partsSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(part =>
        part.name?.toLowerCase().includes(term)
      );
    }
    // Sort
    switch (this.partsSortFilter) {
      case 'name-asc':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock-high':
        filtered = filtered.slice().sort((a, b) => b.quantity - a.quantity);
        break;
      case 'stock-low':
        filtered = filtered.slice().sort((a, b) => a.quantity - b.quantity);
        break;
      case 'price-high':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
    }
    return filtered;
  }

  get paginatedParts() {
    const start = (this.partsCurrentPage - 1) * this.partsPageSize;
    return this.filteredParts.slice(start, start + this.partsPageSize);
  }
  get partsTotalPages() {
    return Math.ceil(this.filteredParts.length / this.partsPageSize);
  }
  get partsPageNumbers() {
    return Array.from({ length: this.partsTotalPages }, (_, i) => i + 1);
  }
  get showingFrom() {
    if (this.filteredParts.length === 0) return 0;
    return (this.partsCurrentPage - 1) * this.partsPageSize + 1;
  }
  get showingTo() {
    return Math.min(this.partsCurrentPage * this.partsPageSize, this.filteredParts.length);
  }
  prevPartsPage() {
    if (this.partsCurrentPage > 1) {
      this.partsCurrentPage--;
    }
  }

  // Service Requests Filtering and Pagination
  get filteredRequests() {
    let filtered = this.requests;
    
    // Search filter
    if (this.requestsSearchTerm.trim()) {
      const term = this.requestsSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(req =>
        req.customer_name?.toLowerCase().includes(term) ||
        req.service_name?.toLowerCase().includes(term) ||
        req.vehicle_make?.toLowerCase().includes(term) ||
        req.vehicle_model?.toLowerCase().includes(term) ||
        req.customer_phone?.includes(term)
      );
    }
    
    // Status filter
    if (this.requestsStatusFilter !== 'all') {
      filtered = filtered.filter(req => req.status === this.requestsStatusFilter);
    }
    
    return filtered;
  }

  get paginatedRequests() {
    const start = (this.requestsCurrentPage - 1) * this.requestsPageSize;
    return this.filteredRequests.slice(start, start + this.requestsPageSize);
  }

  get requestsTotalPages() {
    return Math.ceil(this.filteredRequests.length / this.requestsPageSize);
  }

  get requestsPageNumbers() {
    return Array.from({ length: this.requestsTotalPages }, (_, i) => i + 1);
  }

  get requestsShowingFrom() {
    if (this.filteredRequests.length === 0) return 0;
    return (this.requestsCurrentPage - 1) * this.requestsPageSize + 1;
  }

  get requestsShowingTo() {
    return Math.min(this.requestsCurrentPage * this.requestsPageSize, this.filteredRequests.length);
  }

  // Service Catalog Filtering and Pagination
  get filteredServices() {
    let filtered = this.services;
    
    // Search filter
    if (this.catalogSearchTerm.trim()) {
      const term = this.catalogSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term)
      );
    }
    
    // Sort
    switch (this.catalogSortFilter) {
      case 'name-asc':
        filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-high':
        filtered = filtered.slice().sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered = filtered.slice().sort((a, b) => a.price - b.price);
        break;
      case 'duration-asc':
        filtered = filtered.slice().sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      case 'duration-desc':
        filtered = filtered.slice().sort((a, b) => b.duration.localeCompare(a.duration));
        break;
    }
    
    return filtered;
  }

  get paginatedServices() {
    const start = (this.catalogCurrentPage - 1) * this.catalogPageSize;
    return this.filteredServices.slice(start, start + this.catalogPageSize);
  }

  get catalogTotalPages() {
    return Math.ceil(this.filteredServices.length / this.catalogPageSize);
  }

  get catalogPageNumbers() {
    return Array.from({ length: this.catalogTotalPages }, (_, i) => i + 1);
  }

  get catalogShowingFrom() {
    if (this.filteredServices.length === 0) return 0;
    return (this.catalogCurrentPage - 1) * this.catalogPageSize + 1;
  }

  get catalogShowingTo() {
    return Math.min(this.catalogCurrentPage * this.catalogPageSize, this.filteredServices.length);
  }
  parts: Part[] = [];
  activeTab: 'requests' | 'parts' | 'catalog' = 'requests';
  showAssignModal = false;
  showServiceModal = false;
  showMessageSent = false;

  // Service Requests Pagination Properties
  requestsCurrentPage = 1;
  requestsPageSize = 5;
  requestsSearchTerm = '';
  requestsStatusFilter = 'all';

  // Service Catalog Pagination Properties
  catalogCurrentPage = 1;
  catalogPageSize = 5;
  catalogSearchTerm = '';
  catalogSortFilter = 'name-asc';
  getPartIconColor(category: string): string {
    switch (category) {
      case 'Engine': return 'text-blue-600';
      case 'Brakes': return 'text-red-600';
      case 'Suspension': return 'text-blue-600';
      case 'Electrical': return 'text-purple-600';
      case 'Filters': return 'text-green-600';
      case 'Fluids': return 'text-cyan-600';
      case 'Exterior': return 'text-gray-700';
      case 'Interior': return 'text-pink-600';
      default: return 'text-gray-400';
    }
  }
  sendCustomerMessage() {
    this.showMessageSent = true;
    setTimeout(() => {
      this.showMessageSent = false;
    }, 2000);
  }

  // View details modal state
  showViewModal = false;
  viewRequest: any = null;

  openViewModal(req: any) {
    // Fetch all details for the request and set mechanic name if present
    this.viewRequest = { ...req };
    // If mechanic_name is present (from backend join), set mechanic for display
    if (req.mechanic_name) {
      this.viewRequest.mechanic = req.mechanic_name;
    } else if (req.mechanic_id) {
      const found = this.mechanics.find((m: any) => m.id === req.mechanic_id);
      if (found) this.viewRequest.mechanic = found.name;
    }
    // Optionally fetch service, vehicle, customer details if not present
    // (Assume req already contains all needed fields)
    this.showViewModal = true;
    // Set button visibility flags
    this.viewRequestShowAccept = req.status === 'Pending';
    this.viewRequestShowReject = req.status === 'Pending';
    this.viewRequestShowAssign = req.status === 'Pending';
    this.viewRequestShowComplete = req.status === 'Accepted' || req.status === 'Assigned';
    this.viewRequestShowMechanic = !!this.viewRequest.mechanic;
    // For all statuses, show all details
  }

  closeViewModal() {
    this.showViewModal = false;
    this.viewRequest = null;
    this.viewRequestShowAccept = false;
    this.viewRequestShowReject = false;
    this.viewRequestShowAssign = false;
    this.viewRequestShowComplete = false;
    this.viewRequestShowMechanic = false;
  }

  // Static data
  requests: any[] = [];

  // (parts array moved above and expanded)
  services: Service[] = [];
  constructor(
    private serviceService: ServiceService,
    private appointmentService: AppointmentService,
    private mechanicService: MechanicService,
    private partsService: PartsService
  ) {}

  ngOnInit() {
    this.fetchServices();
    this.fetchRequests();
    this.fetchMechanics();
    this.fetchParts();
  }
  
  fetchParts() {
    this.partsService.getParts().subscribe({
      next: (data) => {
        this.parts = data;
      },
      error: () => {
        this.parts = [];
      }
    });
  }
  saveNewPart() {
    this.partsService.addPart(this.newPart).subscribe({
      next: (newPart) => {
        this.parts.unshift(newPart);
        this.closeAddPartModal();
      },
      error: () => {
        alert('Failed to add part.');
      }
    });
  }
  saveEditPart() {
    this.partsService.updatePart(this.editPart.id, this.editPart).subscribe({
      next: (updatedPart) => {
        // Refresh parts list from backend
        this.fetchParts();
        // Close the edit modal
        this.closeEditPartModal();
      },
      error: () => {
        alert('Failed to update part.');
      }
    });
  }
  deletePart(part: any) {
    if (confirm('Are you sure you want to delete this part?')) {
      this.partsService.deletePart(part.id).subscribe({
        next: () => {
          this.fetchParts();
        },
        error: () => {
          alert('Failed to delete part.');
        }
      });
    }
  }

  fetchRequests() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data: any[]) => {
        this.requests = data || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch appointment requests', err);
        this.requests = [];
      }
    });
  }

  fetchServices() {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
      },
      error: (err: any) => console.error('Failed to fetch services', err)
    });
  }

  fetchMechanics() {
    this.mechanicService.getAllMechanics().subscribe({
      next: (data: any[]) => {
        this.mechanics = data || [];
      },
      error: (err: any) => {
        console.error('Failed to fetch mechanics', err);
        this.mechanics = [];
      }
    });
  }

  // Remove the duplicate saveService at the bottom of the file
  mechanics = [
    { id: '1', name: 'Bennet', specialization: 'Engine Specialist' },
    { id: '2', name: 'Kumar', specialization: 'Brake Specialist' },
    { id: '3', name: 'Raj', specialization: 'General' }
  ];

  // Modal state
  assignRequest: any = null;
  assignMechanicId: string = '';
  serviceToEdit: any = null;

  // Tab switching
  setActiveTab(tab: 'requests' | 'parts' | 'catalog') {
    this.activeTab = tab;
  }

  // Assign Mechanic Modal
  openAssignModal(request: any) {
    this.assignRequest = request;
    this.assignMechanicId = '';
    this.showAssignModal = true;
  }
  closeAssignModal() {
    this.showAssignModal = false;
    this.assignRequest = null;
    this.assignMechanicId = '';
  }

  // Complete assigned request
  completeRequest(req: any) {
    const reqIdx = this.requests.findIndex((r: any) => r.id === req.id);
    if (reqIdx > -1) {
      this.requests[reqIdx] = {
        ...this.requests[reqIdx],
        status: 'Completed'
      };
    }
    this.closeViewModal();
  }

  // Message state for view modal
  showMessageBox = false;
  messageText = '';
  messageSent = false;

  openMessageBox() {
    this.showMessageBox = true;
    this.messageText = '';
    this.messageSent = false;
  }

  closeMessageBox() {
    this.showMessageBox = false;
    this.messageText = '';
    this.messageSent = false;
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.messageSent = true;
      // Simulate sending message (could be replaced with real logic)
      setTimeout(() => {
        this.closeMessageBox();
        alert('Message sent to customer!');
      }, 800);
    }
  }

  // Services CRUD
  openServiceModal(service: any = null) {
    this.serviceToEdit = service ? { ...service } : { name: '', category: '', duration: '', price: 0 };
    this.showServiceModal = true;
  }
  closeServiceModal() {
    this.showServiceModal = false;
    this.serviceToEdit = null;
  }
  saveService() {
    // requiredParts removed
        if (this.serviceToEdit.id) {
          if (!window.confirm('Are you sure you want to save changes to this service?')) {
            return;
          }
          const { id, name, description, price, duration } = this.serviceToEdit;
          this.serviceService.updateService(id, { name, description, price, duration } as any).subscribe({
            next: () => {
              this.fetchServices();
              this.closeServiceModal();
            },
            error: (err) => alert('Failed to update service: ' + (err.error?.error || err.message))
          });
        } else {
          const { name, description, price, duration } = this.serviceToEdit;
          this.serviceService.addService({ name, description, price, duration } as any).subscribe({
            next: () => {
              this.fetchServices();
              this.closeServiceModal();
            },
            error: (err) => alert('Failed to add service: ' + (err.error?.error || err.message))
          });
    }
  }
  deleteService(id: string) {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }
    this.serviceService.deleteService(Number(id)).subscribe({
      next: () => {
        this.fetchServices();
      },
      error: (err: any) => {
        if (err.status === 404) {
          alert('Service not found. It may have already been deleted.');
          (this as any).fetchServices();
        } else {
          alert('Failed to delete service: ' + (err.error?.error || err.message));
        }
      }
    });
  }

  // Utility

  getAssignedMechanicName(viewRequest: any): string {
    if (viewRequest.mechanic) return viewRequest.mechanic;
    if (viewRequest.mechanic_id) {
      const found = this.mechanics.find((m: any) => m.id === viewRequest.mechanic_id);
      if (found) return found.name;
    }
    return '-';
  }

  // Status badge for requests (duplicate for requests, not parts)
  getRequestStatusClass(status: string): string {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-400';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-400';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700 border-blue-400';
      case 'Completed':
        return 'bg-gray-200 text-gray-800 border-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  // (removed duplicate getStatusClass for requests, now only the new one for parts remains)
  // Restore duplicate getStatusClass for requests
  // ...existing code...

  // Flags for view modal buttons
  viewRequestShowAccept: boolean = false;
  viewRequestShowReject: boolean = false;
  viewRequestShowAssign: boolean = false;
  viewRequestShowComplete: boolean = false;
  viewRequestShowMechanic: boolean = false;
}



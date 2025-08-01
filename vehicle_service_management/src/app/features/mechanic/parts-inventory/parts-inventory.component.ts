import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// ...existing code...
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PartsService, Part } from '../../../services/parts.service';

@Component({
  selector: 'app-parts-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parts-inventory.component.html',
  styleUrls: ['./parts-inventory.component.css']
})
export class PartsInventoryComponent implements OnInit {
  mechanicName: string = '';
  showMobileMenu = false;
  showAddPartModal = false;
  showEditPartModal = false;
  showLogoutPopup = false;
  searchTerm = '';
  categoryFilter = 'all';
  statusFilter = 'all';
  sortFilter = 'name-asc';
  currentPage = 1;
  itemsPerPage = 5;
  selectedPart: Part | null = null;
  partsData: Part[] = [];
  loading = false;
  error = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private partsService: PartsService
  ) {}

  async ngOnInit(): Promise<void> {
    let profile = this.authService.getMechanicProfile();
    if (!profile || !profile.name) {
      await this.authService.loadMechanicProfile();
      profile = this.authService.getMechanicProfile();
    }
    this.mechanicName = profile?.name || 'Mechanic';
    this.fetchParts();
  }

  fetchParts(): void {
    this.loading = true;
    console.log('Fetching parts...');
    this.partsService.getParts().subscribe({
      next: (data) => {
        console.log('Fetched parts:', data);
        this.partsData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Fetch parts error:', err);
        this.error = 'Failed to load parts.';
        this.loading = false;
      }
    });
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Filter and search methods
  get filteredParts(): Part[] {
    let filtered = this.partsData;
    
    // Apply search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(part => 
        part.name.toLowerCase().includes(search)
      );
    }
    
    // Apply category filter
    if (this.categoryFilter !== 'all') {
      // If you want to filter by category, ensure your backend model has a category field
      // filtered = filtered.filter(part => part.category === this.categoryFilter);
    }
    
    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(part => this.getPartStatus(part.quantity, 5) === this.statusFilter);
    }
    
    // Apply sorting
    switch(this.sortFilter) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'stock-high':
        filtered.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'stock-low':
        filtered.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
    }
    
    return filtered;
  }

  get paginatedParts(): Part[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredParts.slice(startIndex, endIndex);
  }

  // Pagination methods
  getTotalPages(): number {
    return Math.ceil(this.filteredParts.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredParts.length);
  }

  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  // Filter change handlers
  onSearchChange(): void {
    this.currentPage = 1;
  }

  onCategoryChange(): void {
    this.currentPage = 1;
  }

  onStatusChange(): void {
    this.currentPage = 1;
  }

  // Modal methods
  showAddModal(): void {
    this.showAddPartModal = true;
  }

  hideAddModal(): void {
    this.showAddPartModal = false;
  }

  showEditModal(part: Part): void {
    this.selectedPart = { ...part };
    this.showEditPartModal = true;
  }

  hideEditModal(): void {
    this.showEditPartModal = false;
    this.selectedPart = null;
  }

  // Part management methods
  addPart(partData: Partial<Part>): void {
    this.loading = true;
    this.partsService.addPart(partData).subscribe({
      next: (newPart) => {
        this.partsData.unshift(newPart);
        this.hideAddModal();
        this.currentPage = 1;
        this.showNotification('Part added successfully!', 'success');
        this.loading = false;
      },
      error: () => {
        this.showNotification('Failed to add part.', 'error');
        this.loading = false;
      }
    });
  }

  updatePart(partData: Part): void {
    this.loading = true;
    console.log('Calling updatePart with:', partData);
    this.partsService.updatePart(partData.id as any, partData).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        this.hideEditModal();
        this.showNotification('Part updated successfully!', 'success');
        this.fetchParts(); // Refetch parts to refresh table
        this.loading = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.showNotification('Failed to update part.', 'error');
        this.loading = false;
      }
    });
  }

  // Removed saveEditPart. Always use updatePart to persist changes to backend and refresh table.

  deletePart(partId: string): void {
    if (confirm('Are you sure you want to delete this part?')) {
      this.loading = true;
      this.partsService.deletePart(Number(partId)).subscribe({
        next: () => {
      this.partsData = this.partsData.filter(part => part.id !== Number(partId));
          this.showNotification('Part deleted successfully!', 'success');
          this.loading = false;
        },
        error: () => {
          this.showNotification('Failed to delete part.', 'error');
          this.loading = false;
        }
      });
    }
  }

  // Helper methods
  getPartStatus(stock: number, minStock: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    if (stock === 0) {
      return 'Out of Stock';
    } else if (stock <= minStock) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  }

  getPartIcon(category: string): string {
    switch(category) {
      case 'Fluids': return 'fas fa-oil-can';
      case 'Brakes': return 'fas fa-stop-circle';
      case 'Filters': return 'fas fa-filter';
      case 'Engine': return 'fas fa-cog';
      case 'Electrical': return 'fas fa-bolt';
      case 'Exterior': return 'fas fa-car-side';
      case 'Interior': return 'fas fa-chair';
      case 'Suspension': return 'fas fa-car-bump';
      default: return 'fas fa-box';
    }
  }

  getPartIconColor(category: string): string {
    switch(category) {
      case 'Fluids': return 'text-darkblue-600';
      case 'Brakes': return 'text-red-600';
      case 'Filters': return 'text-green-600';
      case 'Engine': return 'text-gray-600';
      case 'Electrical': return 'text-yellow-600';
      case 'Exterior': return 'text-indigo-600';
      case 'Interior': return 'text-purple-600';
      case 'Suspension': return 'text-orange-600';
      default: return 'text-gray-400';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  // Navigation methods
  navigateToProfile(): void {
    this.router.navigate(['/mechanic/profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/mechanic/dashboard']);
  }

  // Logout methods
  confirmLogout(): void {
    this.showLogoutPopup = true;
  }

  hideLogoutPopup(): void {
    this.showLogoutPopup = false;
  }

  performLogout(): void {
    console.log('Mechanic logout requested');
    this.hideLogoutPopup();
    this.authService.logout();
  }

  // Notification method
  showNotification(message: string, type: string): void {
    alert(message);
  }
}

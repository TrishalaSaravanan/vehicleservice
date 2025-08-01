import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mechanic-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-[#1B4B88] text-white p-6 space-y-8 fixed h-full shadow-xl">
      <!-- Logo Section -->
      <div class="flex items-center space-x-3">
        <i class="fas fa-wrench text-2xl text-white"></i>
        <h1 class="text-2xl font-bold">MechniQ</h1>
      </div>
      
      <!-- Navigation Menu -->
      <nav>
        <ul class="space-y-2">
          <li>
            <a routerLink="/mechanic/dashboard" 
               routerLinkActive="active"
               [routerLinkActiveOptions]="{exact: true}"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/mechanic/work-orders" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-clipboard-list"></i>
              <span>Work Orders</span>
            </a>
          </li>
          <li>
            <a routerLink="/mechanic/service-history" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-history"></i>
              <span>Service History</span>
            </a>
          </li>
          <li>
            <a routerLink="/mechanic/parts-inventory" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-boxes"></i>
              <span>Parts Inventory</span>
            </a>
          </li>
          <li>
            <a routerLink="/mechanic/profile" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <!-- Logout Section -->
      <div class="absolute bottom-6 left-6 right-6">
        <button (click)="confirmLogout()" 
                class="w-full flex items-center justify-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-red-600 hover:bg-opacity-80 transition cursor-pointer">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Logout Confirmation Modal -->
    <div *ngIf="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Confirm Logout</h3>
          <button (click)="hideLogoutModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <p class="text-gray-600 mb-6">Are you sure you want to logout?</p>
        <div class="flex space-x-4">
          <button (click)="hideLogoutModal()" 
                  class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition">
            Cancel
          </button>
          <button (click)="performLogout()" 
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-link {
      transition: all 0.3s ease;
    }
    .sidebar-link:hover {
      transform: translateX(5px);
    }
    .sidebar-link.active {
      background-color: rgb(37 99 235); /* blue-600 */
      border-left: 4px solid #60A5FA; /* blue-400 */
      transform: translateX(5px);
    }
    :host {
      --primary: #1B4B88;
    }
    
    /* Make sure the active class shows properly */
    a.active {
      background-color: rgb(37 99 235) !important; /* blue-600 */
      border-left: 4px solid #60A5FA; /* blue-400 */
    }
  `]
})
export class MechanicSidebarComponent {
  currentUrl: string = '';
  showLogoutModal: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Subscribe to router events to track current URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
    
    // Set initial URL
    this.currentUrl = this.router.url;
  }

  isActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }

  confirmLogout(): void {
    this.showLogoutModal = true;
  }

  hideLogoutModal(): void {
    this.showLogoutModal = false;
  }

  performLogout(): void {
    console.log('Mechanic logout requested');
    this.authService.logout();
    this.hideLogoutModal();
  }
}

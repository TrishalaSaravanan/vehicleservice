import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="w-64 bg-slate-800 text-white p-6 space-y-8 fixed h-full shadow-xl">
      <div class="flex items-center space-x-3">
        <h1 class="text-2xl font-bold">MechniQ</h1>
      </div>
      <nav>
        <ul class="space-y-2">
          <li>
            <a routerLink="/admin/dashboard" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-home"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/user-management" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-users"></i>
              <span>User Management</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/service-management" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-cogs"></i>
              <span>Service Management</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/content-management" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-file-alt"></i>
              <span>Content Management</span>
            </a>
          </li>
          <li>
            <a routerLink="/admin/report-management" 
               routerLinkActive="active"
               class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-slate-700 cursor-pointer transition-all duration-300">
              <i class="fas fa-chart-line"></i>
              <span>Report Management</span>
            </a>
          </li>
        </ul>
      </nav>
      <div class="absolute bottom-6 left-6 right-6">
        <a (click)="logout()" class="flex items-center space-x-3 sidebar-link py-3 px-4 rounded-lg hover:bg-red-600 hover:bg-opacity-80 transition cursor-pointer">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar-link {
      transition: all 0.3s ease;
    }
    .sidebar-link:hover {
      transform: translateX(5px);
    }
    .sidebar-link.active {
      background-color: rgb(51 65 85); /* slate-600 */
      border-left: 4px solid #3B82F6; /* blue-500 */
      transform: translateX(5px);
    }
    :host {
      --primary: #1E293B; /* slate-800 */
    }
    
    /* Make sure the active class shows properly */
    a.active {
      background-color: rgb(51 65 85) !important; /* slate-600 */
      border-left: 4px solid #3B82F6; /* blue-500 */
    }
  `]
})
export class AdminSidebarComponent {
  currentUrl: string = '';

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

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      console.log('Admin logout requested');
      this.authService.logout();
    }
  }
}
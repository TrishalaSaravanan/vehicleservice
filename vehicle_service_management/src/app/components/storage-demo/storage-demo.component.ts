import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, AuthResponse, User } from '../../services/auth.service';

@Component({
  selector: 'app-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './storage-demo.component.html',
  styleUrl: './storage-demo.component.css'
})
export class StorageDemoComponent implements OnInit {
  currentUser: User | null = null;

  // Remove newUser and related logic

  loginResult: any = null;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  // Remove toggleUserStatus and deleteUser

  // Remove addNewUser, isFormValid, resetForm

  // Remove exportData, clearAllData, resetToDefault

  async testLogin(email: string, password: string): Promise<void> {
    console.log('Testing login for:', email);
    this.loginResult = await this.authService.login({ email, password });
    if (this.loginResult.success) {
      this.currentUser = this.authService.getCurrentUser();
      console.log('Login successful, current user:', this.currentUser);
      console.log('Navigating to dashboard...');
      await this.authService.navigateToDashboard();
    }
  }

  // Remove reinitializeUsers

  logout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.loginResult = null;
  }

  // Remove loadData

  // Remove getRoleBadgeClass
}

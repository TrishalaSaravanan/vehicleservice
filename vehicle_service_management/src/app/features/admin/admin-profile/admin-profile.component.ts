import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit {
  // Profile data
  adminName: string = 'Trishala';
  adminEmail: string = 'admin@mechniq.com';
  adminRole: string = 'Super Admin';
  joinDate: string = 'January 15, 2022';
  lastLogin: string = 'Today at 10:30 AM';
  profileImage: string = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiNEM0Q5REYiLz4KPHBhdGggZD0iTTY0IDY0QzUyIDY0IDQyIDU0IDQyIDQyUzUyIDIwIDY0IDIwUzg2IDMwIDg2IDQyUzc2IDY0IDY0IDY0Wk02NCA3NkMzNiA3NiAzNiA4NiAzNiA5NlYxMDhIOTJWOTZDOTIgODYgOTIgNzYgNjQgNzZaIiBmaWxsPSIjOUI5QkEyIi8+Cjwvc3ZnPg==';

  // Edit form data
  editName: string = '';
  editEmail: string = '';
  editRole: string = 'super_admin';

  // View state
  isEditMode: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize edit form with current data
    this.editName = this.adminName;
    this.editEmail = this.adminEmail;
    this.editRole = this.adminRole === 'Super Admin' ? 'super_admin' : 
                   this.adminRole === 'Admin' ? 'admin' : 'moderator';
    
    // Set current date/time for last login
    const now = new Date();
    this.lastLogin = `Today at ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  }

  onImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openEditProfile(): void {
    this.isEditMode = true;
    // Reset form data
    this.editName = this.adminName;
    this.editEmail = this.adminEmail;
    this.editRole = this.adminRole === 'Super Admin' ? 'super_admin' : 
                   this.adminRole === 'Admin' ? 'admin' : 'moderator';
  }

  closeEditProfile(): void {
    this.isEditMode = false;
  }

  saveProfile(): void {
    // Update profile data
    this.adminName = this.editName;
    this.adminRole = this.editRole === 'super_admin' ? 'Super Admin' : 
                    this.editRole === 'admin' ? 'Admin' : 'Moderator';

    // In a real application, you would send this data to a backend API
    console.log('Profile updated:', {
      name: this.adminName,
      email: this.adminEmail,
      role: this.adminRole
    });

    // Show success message
    alert('Profile updated successfully!');
    this.closeEditProfile();
  }

  goBackToAdmin(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  triggerImageUpload(): void {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput?.click();
  }
}

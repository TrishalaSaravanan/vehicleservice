import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MechanicService } from '../../../services/mechanic.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-mechanic-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mechanic-profile.component.html',
  styleUrls: ['./mechanic-profile.component.css']
})
export class MechanicProfileComponent implements OnInit {
  mechanic: any = {};
  isEditing = false;
  editData: any = {};

  constructor(
    private router: Router,
    private mechanicService: MechanicService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Get current user (mechanic) from auth service
    let user = this.authService.getCurrentUser();
    
    if (!user || user.role !== 'mechanic') {
      // Try to reload user from token
      const token = this.authService.getToken();
      if (token) {
        try {
          // Load mechanic profile
          await this.authService.loadMechanicProfile();
          const mechProfile = this.authService.getMechanicProfile();
          if (mechProfile) {
            user = {
              id: mechProfile.user_id,
              email: mechProfile.email,
              role: 'mechanic'
            };
          }
        } catch (error) {
          console.error('Failed to load mechanic profile:', error);
          // Redirect to login if profile loading fails
          this.router.navigate(['/login']);
          return;
        }
      } else {
        // No token, redirect to login
        this.router.navigate(['/login']);
        return;
      }
    }

    console.log('Current mechanic user:', user);
    
    // If we have a cached mechanic profile, use it directly
    const cachedProfile = this.authService.getMechanicProfile();
    if (cachedProfile) {
      this.mechanic = cachedProfile;
      this.editData = { ...this.mechanic };
      console.log('Using cached mechanic profile:', this.mechanic);
    } else if (user && user.id) {
      // Fallback: Fetch all mechanics and find the one matching the logged-in user
      this.mechanicService.getAllMechanics().subscribe({
        next: (mechanics) => {
          console.log('Mechanics from backend:', mechanics);
          const found = mechanics.find((m: any) => m.user_id === user.id);
          console.log('Matched mechanic:', found);
          if (found) {
            this.mechanic = found;
            this.editData = { ...this.mechanic };
          } else {
            console.error('Mechanic not found for user:', user);
          }
        },
        error: (error) => {
          console.error('Failed to fetch mechanics:', error);
        }
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData = { ...this.mechanic };
    }
  }

  saveProfile(): void {
    // Update mechanic profile in backend
    this.mechanicService.updateMechanic(this.mechanic.id, this.editData).subscribe(() => {
      this.mechanic = { ...this.editData };
      this.isEditing = false;
      alert('Profile updated successfully!');
      this.router.navigate(['/mechanic/dashboard']);
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editData = { ...this.mechanic };
  }


  goBack(): void {
    this.router.navigate(['/mechanic/dashboard']);
  }
}

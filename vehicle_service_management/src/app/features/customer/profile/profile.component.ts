import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  name: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  profilePic: string | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCustomerProfile()
      .then(res => {
        if (res && res.success && res.profile) {
          this.name = res.profile.name;
          this.email = res.profile.email;
          this.address = res.profile.address || '';
          this.phone = res.profile.phone || '';
        } else {
          this.error = 'Failed to load profile.';
        }
        this.loading = false;
      })
      .catch(() => {
        this.error = 'Failed to load profile.';
        this.loading = false;
      });
  }

  onProfilePicChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  navigateHome() {
    this.router.navigate(['/customer/home']);
  }

  navigateToEditProfile() {
    this.router.navigate(['/customer/profile/edit']);
  }

  navigateToAppointments() {
    this.router.navigate(['/customer/appointments']);
  }

  navigateToVehicles() {
    this.router.navigate(['/customer/vehicles']);
  }
}

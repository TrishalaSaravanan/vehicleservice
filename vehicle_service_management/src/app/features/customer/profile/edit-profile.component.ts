
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profile = {
    name: '',
    email: '',
    address: '',
    phone: ''
  };
  showToast = false;
  toastMessage = '';
  error = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCustomerProfile()
      .then(res => {
        if (res && res.success && res.profile) {
          this.profile.name = res.profile.name;
          this.profile.email = res.profile.email;
          this.profile.address = res.profile.address || '';
          this.profile.phone = res.profile.phone || '';
        } else {
          this.error = 'Failed to load profile.';
        }
      })
      .catch(() => {
        this.error = 'Failed to load profile.';
      });
  }

  navigateToProfile() {
    this.router.navigate(['/customer/profile']);
  }

  onSubmit() {
    this.authService.updateCustomerProfile({
      address: this.profile.address,
      phone: this.profile.phone
    })
      .then(res => {
        if (res && res.success) {
          this.showToast = true;
          this.toastMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.showToast = false;
            this.navigateToProfile();
          }, 1500);
        } else {
          this.error = 'Failed to update profile.';
        }
      })
      .catch(() => {
        this.error = 'Failed to update profile.';
      });
  }
}

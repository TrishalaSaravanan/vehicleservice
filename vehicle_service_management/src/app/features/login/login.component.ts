import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Form model
  loginData: LoginCredentials = {
    email: '',
    password: ''
  };

  // UI state
  showPassword = false;
  isLoading = false;
  loginError = '';

  // Error messages
  errors = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    // if (this.authService.isAuthenticated()) {
    //   this.authService.navigateToDashboard().then(
    //     (success) => {
    //       if (!success) {
    //         console.log('Auto-navigation failed');
    //       }
    //     }
    //   ).catch(
    //     (error) => {
    //       console.error('Auto-navigation error:', error);
    //     }
    //   );
    // }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Validate email
  validateEmail(): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.loginData.email) {
      this.errors.email = 'Email is required';
      return false;
    } else if (!emailRegex.test(this.loginData.email)) {
      this.errors.email = 'Please enter a valid email address';
      return false;
    } else {
      this.errors.email = '';
      return true;
    }
  }

  // Validate password
  validatePassword(): boolean {
    if (!this.loginData.password) {
      this.errors.password = 'Password is required';
      return false;
    } else if (this.loginData.password.length < 6) {
      this.errors.password = 'Password must be at least 6 characters long';
      return false;
    } else {
      this.errors.password = '';
      return true;
    }
  }

  // Handle form submission
  async onSubmit() {
    console.log('Login form submitted');
    this.loginError = '';
    this.isLoading = true;

    // Validate form
    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (isEmailValid && isPasswordValid) {
      console.log('Form validation passed, attempting login');
      try {
        // Await login using auth service
        const result = await this.authService.login(this.loginData);
        if (result.success) {
          console.log('Login successful, navigating to dashboard');
          // Navigate to appropriate dashboard
          const navigationSuccess = await this.authService.navigateToDashboard();
          if (navigationSuccess) {
            console.log('Navigation successful');
          } else {
            console.log('Navigation failed');
            this.loginError = 'Navigation failed. Please try again.';
            this.isLoading = false;
          }
        } else {
          console.log('Login failed:', result.message);
          this.loginError = result.message;
          this.isLoading = false;
        }
      } catch (error) {
        console.error('Login error:', error);
        this.loginError = 'An unexpected error occurred. Please try again.';
        this.isLoading = false;
      }
    } else {
      console.log('Form validation failed');
      this.isLoading = false;
    }
  }

  // Navigate to signup
  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  // Navigate to home
  navigateToHome() {
    this.router.navigate(['/']);
  }
}
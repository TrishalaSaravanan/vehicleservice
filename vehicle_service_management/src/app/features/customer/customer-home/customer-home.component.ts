import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface Service {
  id: number;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-home.component.html',
  styleUrl: './customer-home.component.css'
})
export class CustomerHomeComponent implements OnInit {
  customerName: string = '';
  
  // UI state
  isProfileDropdownOpen = false;
  showLogoutModal = false;
  showLogoutSuccessModal = false;
  showToast = false;
  isToastError = false;
  toastMessage = '';
  toastIcon = 'fas fa-check-circle';

  // Contact form
  contactForm: FormGroup;

  // Services data
  services: Service[] = [
    { id: 1, name: 'AC Service', description: 'Cooling system maintenance', image: 'assets/ac services.jpg' },
    { id: 2, name: 'Battery Check', description: 'Complete battery diagnostics', image: 'assets/battery check.jpg' },
    { id: 3, name: 'Brake Service', description: 'Pad replacement & maintenance', image: 'assets/brake services.jpg' },
    { id: 4, name: 'Car Wash', description: 'Premium cleaning services', image: 'assets/car wash.jpg' },
    { id: 5, name: 'Fuel Cleaning', description: 'Injector cleaning service', image: 'assets/fuel cleaning.jpg' },
    { id: 6, name: 'Oil Service', description: 'Engine oil & filter change', image: 'assets/oil service.jpg' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCustomerData();
    this.setupScrollListeners();
  }

  // Navigation methods
  navigateToBookAppointment() {
    this.router.navigate(['/customer/book-appointment']);
  }

  navigateToServiceHistory() {
    this.router.navigate(['/customer/service-history']);
  }

  navigateToProfile() {
    this.router.navigate(['/customer/profile']);
    this.isProfileDropdownOpen = false;
  }

  navigateToAppointments() {
    this.router.navigate(['/customer/appointments']);
    this.isProfileDropdownOpen = false;
  }

  navigateToVehicles() {
    this.router.navigate(['/customer/vehicles']);
    this.isProfileDropdownOpen = false;
  }

  navigateToContact() {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  }

  bookService(serviceId: number) {
    this.router.navigate(['/customer/book-appointment'], {
      queryParams: { serviceId }
    });
  }

  // UI Interaction methods
  toggleProfileDropdown() {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
    this.isProfileDropdownOpen = false;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.showLogoutModal = false;
      this.showToast = true;
      this.isToastError = false;
      this.toastMessage = "Logged out successfully!";
      this.toastIcon = 'fas fa-check-circle';
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } catch (error) {
      this.showToast = true;
      this.isToastError = true;
      this.toastMessage = "Logout failed. Please try again.";
      this.toastIcon = 'fas fa-exclamation-circle';
    }
  }

  // Form submission
  async onSubmit() {
    if (this.contactForm.valid) {
      try {
        // Here you would typically send the form data to your backend
        console.log('Form submitted:', this.contactForm.value);
        this.showToast = true;
        this.isToastError = false;
        this.toastMessage = "Message sent successfully!";
        this.toastIcon = 'fas fa-check-circle';
        this.contactForm.reset();
      } catch (error) {
        this.showToast = true;
        this.isToastError = true;
        this.toastMessage = "Failed to send message. Please try again.";
        this.toastIcon = 'fas fa-exclamation-circle';
      }
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    } else {
      this.showToast = true;
      this.isToastError = true;
      this.toastMessage = "Please fill all required fields correctly.";
      this.toastIcon = 'fas fa-exclamation-circle';
    }
  }

  // Scroll functionality
  setupScrollListeners() {
    const scrollUpArrow = document.getElementById('scrollUpArrow');
    const scrollDownArrow = document.getElementById('scrollDownArrow');

    window.addEventListener('scroll', () => {
      if (scrollUpArrow && scrollDownArrow) {
        // Show/hide up arrow
        if (window.scrollY > window.innerHeight / 2) {
          scrollUpArrow.style.opacity = '1';
          scrollUpArrow.style.visibility = 'visible';
        } else {
          scrollUpArrow.style.opacity = '0';
          scrollUpArrow.style.visibility = 'hidden';
        }

        // Show/hide down arrow
        if (window.scrollY + window.innerHeight < document.body.scrollHeight - 100) {
          scrollDownArrow.style.opacity = '1';
          scrollDownArrow.style.visibility = 'visible';
        } else {
          scrollDownArrow.style.opacity = '0';
          scrollDownArrow.style.visibility = 'hidden';
        }
      }
    });
  }

  scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentScroll = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.offsetTop > currentScroll + 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  scrollToPrevSection() {
    const sections = Array.from(document.querySelectorAll('section')).reverse();
    const currentScroll = window.scrollY;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (section.offsetTop < currentScroll - 100) {
        section.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }

  // Data loading methods
  private loadCustomerData() {
    const user = this.authService.getCurrentUser();
    this.customerName = user?.email || '';
  }

  // Click outside handler
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const profileContainer = document.getElementById('profile-container');
    if (profileContainer && !profileContainer.contains(event.target as Node)) {
      this.isProfileDropdownOpen = false;
    }
  }
}
